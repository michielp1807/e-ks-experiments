class DragSession {
  readonly target: HTMLTableRowElement;
  readonly startRect: DOMRect;
  readonly startIndex: number;
  readonly startY: number;
  readonly startScrollY: number;
  readonly touchId: number | null;

  boundaryTop = 0;
  boundaryBottom = 0;
  positions: number[] = [];
  liveOrder: HTMLTableRowElement[];
  pendingY: number | null = null;
  animationScheduled = false;
  isDragging = false;

  constructor(
    target: HTMLTableRowElement,
    clientY: number,
    startIndex: number,
    rows: HTMLTableRowElement[],
    touchId: number | null,
  ) {
    this.target = target;
    this.startRect = target.getBoundingClientRect();
    this.startIndex = startIndex;
    this.startY = clientY;
    this.startScrollY = globalThis.scrollY;
    this.liveOrder = rows;
    this.touchId = touchId;
  }

  setGeometry(rows: HTMLTableRowElement[]) {
    const rects = rows.map((row) => row.getBoundingClientRect());
    const scrollY = globalThis.scrollY;
    this.positions = rects.map((rect) => rect.top + scrollY + rect.height / 2);
    this.boundaryTop = Math.min(...rects.map((rect) => rect.top + scrollY));
    this.boundaryBottom = Math.max(
      ...rects.map((rect) => rect.bottom + scrollY),
    );
  }

  setPendingY(clientY: number) {
    this.pendingY = clientY;
  }

  getPendingY() {
    return this.pendingY;
  }

  scheduleAnimation() {
    if (this.animationScheduled) {
      return false;
    }

    this.animationScheduled = true;
    return true;
  }

  startFrame() {
    this.animationScheduled = false;
  }

  markDragging() {
    this.isDragging = true;
  }

  computeDragDelta(pendingY: number) {
    const currentScroll = globalThis.scrollY;
    const startDocY = this.startY + this.startScrollY;
    const currentDocY = pendingY + currentScroll;

    let deltaY = currentDocY - startDocY;
    const startRectTopDoc = this.startRect.top + this.startScrollY;
    const startRectBottomDoc = this.startRect.bottom + this.startScrollY;
    const minDelta = this.boundaryTop - startRectTopDoc;
    const maxDelta = this.boundaryBottom - startRectBottomDoc;

    if (deltaY < minDelta) {
      deltaY = minDelta;
    } else if (deltaY > maxDelta) {
      deltaY = maxDelta;
    }

    const currentTop = startRectTopDoc + deltaY;
    const currentBottom = currentTop + this.startRect.height;
    return { deltaY, currentTop, currentBottom };
  }

  shiftOtherRows(
    rows: HTMLTableRowElement[],
    currentTop: number,
    currentBottom: number,
  ) {
    const moveUp = `translate(0, ${-this.startRect.height}px)`;
    const moveDown = `translate(0, ${this.startRect.height}px)`;
    const movedAbove = new Set<number>();
    const movedBelow = new Set<number>();

    rows.forEach((row, index) => {
      if (row === this.target) return;

      const originallyBelow = index > this.startIndex;
      const originallyAbove = index < this.startIndex;

      if (originallyBelow && currentBottom > this.positions[index]) {
        row.style.transform = moveUp;
        movedBelow.add(index);
      } else if (originallyAbove && currentTop < this.positions[index]) {
        row.style.transform = moveDown;
        movedAbove.add(index);
      } else {
        row.style.transform = "";
      }
    });

    return { movedAbove, movedBelow };
  }

  updateLiveOrder(
    rows: HTMLTableRowElement[],
    movedAbove: Set<number>,
    movedBelow: Set<number>,
  ) {
    const dragIndex = this.startIndex - movedAbove.size + movedBelow.size;
    const newOrder: Array<HTMLTableRowElement | null> = new Array(
      rows.length,
    ).fill(null);

    rows.forEach((row, index) => {
      let newIndex = index;

      if (row === this.target) {
        newIndex = dragIndex;
      } else if (index < this.startIndex && movedAbove.has(index)) {
        newIndex = index + 1;
      } else if (index > this.startIndex && movedBelow.has(index)) {
        newIndex = index - 1;
      }

      newOrder[newIndex] = row;
    });

    const compactOrder = newOrder.filter(
      (row): row is HTMLTableRowElement => row !== null,
    );
    this.liveOrder = compactOrder;
    return compactOrder;
  }

  getOrder(fallback: HTMLTableRowElement[]) {
    return this.liveOrder ?? fallback;
  }

  getActiveTouch(touches: TouchList) {
    if (this.touchId === null) {
      return null;
    }

    return (
      Array.from(touches).find((touch) => touch.identifier === this.touchId) ??
      null
    );
  }
}

class SortableTable {
  private tbody: HTMLTableSectionElement;
  private rows: HTMLTableRowElement[];
  private handles: HTMLElement[] = [];
  private positionCellCache = new Map<
    HTMLTableRowElement,
    HTMLTableCellElement
  >();
  private drag: DragSession | null = null;
  private dragStartOrder: string[] | null = null;
  private timeout: number | null = null;
  private onChange?: (order: string[]) => void;

  private mouseMove = (event: MouseEvent) =>
    this.handlePointerMove(event.clientY);
  private mouseUp = (event: MouseEvent) => {
    if (!this.drag) return;
    event.preventDefault();
    this.finishDrag();
  };
  private touchMove = (event: TouchEvent) => {
    if (!this.drag) return;
    const touch = this.drag.getActiveTouch(event.changedTouches);
    if (!touch) return;
    event.preventDefault();
    this.handlePointerMove(touch.clientY);
  };
  private touchEnd = (event: TouchEvent) => {
    if (!this.drag?.getActiveTouch(event.changedTouches)) return;
    event.preventDefault();
    this.finishDrag();
  };

  constructor(
    tbody: HTMLTableSectionElement,
    onChange?: (order: string[]) => void,
  ) {
    this.tbody = tbody;
    this.rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr"));
    this.onChange = onChange;
  }

  attach() {
    this.refreshHandles();
    this.attachHandleEvents();
    globalThis.addEventListener("mousemove", this.mouseMove);
    globalThis.addEventListener("mouseup", this.mouseUp);
    globalThis.addEventListener("touchmove", this.touchMove, {
      passive: false,
    });
    globalThis.addEventListener("touchend", this.touchEnd);
    globalThis.addEventListener("touchcancel", this.touchEnd);
  }

  detach() {
    globalThis.removeEventListener("mousemove", this.mouseMove);
    globalThis.removeEventListener("mouseup", this.mouseUp);
    globalThis.removeEventListener("touchmove", this.touchMove);
    globalThis.removeEventListener("touchend", this.touchEnd);
    globalThis.removeEventListener("touchcancel", this.touchEnd);
  }

  private refreshHandles() {
    this.rows = Array.from(
      this.tbody.querySelectorAll<HTMLTableRowElement>("tr"),
    );
    this.handles = Array.from(
      this.tbody.querySelectorAll<HTMLElement>("tr td.drag-handle"),
    );
  }

  private attachHandleEvents() {
    this.handles.forEach((handle) => {
      const row = handle.closest("tr");
      if (!row) return;

      handle.onmousedown = (event) => {
        event.preventDefault();
        this.reset();
        this.startDrag(row as HTMLTableRowElement, event.clientY);
      };

      handle.ontouchstart = (event) => {
        if (this.drag) return;
        const touch = event.changedTouches[0];
        if (!touch) return;
        event.preventDefault();
        this.reset();
        this.startDrag(
          row as HTMLTableRowElement,
          touch.clientY,
          touch.identifier,
        );
      };
    });
  }

  private startDrag(
    row: HTMLTableRowElement,
    clientY: number,
    touchId: number | null = null,
  ) {
    this.refreshHandles();
    this.dragStartOrder = this.getRowOrderIds(this.rows);
    this.drag = new DragSession(
      row,
      clientY,
      this.rows.indexOf(row),
      this.rows.slice(),
      touchId,
    );
    row.classList.add("dragging");
    this.computeGeometry();
    this.updatePositionLabels(this.rows);
  }

  private computeGeometry() {
    this.drag?.setGeometry(this.rows);
  }

  private handlePointerMove(clientY: number) {
    if (!this.drag) return;
    this.drag.setPendingY(clientY);
    if (!this.drag.scheduleAnimation()) return;
    requestAnimationFrame(() => this.runDragUpdate());
  }

  private runDragUpdate() {
    const drag = this.drag;
    if (!drag) return;
    drag.startFrame();
    const pendingY = drag.getPendingY();
    if (pendingY === null) return;

    const scrolled = this.autoScrollIfNeeded(pendingY);
    drag.markDragging();

    const { deltaY, currentTop, currentBottom } =
      drag.computeDragDelta(pendingY);
    drag.target.style.transform = `translate(0, ${deltaY}px)`;
    const { movedAbove, movedBelow } = drag.shiftOtherRows(
      this.rows,
      currentTop,
      currentBottom,
    );
    const compactOrder = drag.updateLiveOrder(
      this.rows,
      movedAbove,
      movedBelow,
    );
    this.updatePositionLabels(compactOrder);

    if (scrolled) {
      this.handlePointerMove(pendingY);
    }
  }

  private autoScrollIfNeeded(pointerY: number) {
    const threshold = 40;
    const step = 15;
    const viewportHeight = globalThis.innerHeight;
    let scrolled = false;

    if (pointerY < threshold) {
      globalThis.scrollBy(0, -Math.min(step, threshold - pointerY));
      scrolled = true;
    } else if (pointerY > viewportHeight - threshold) {
      globalThis.scrollBy(
        0,
        Math.min(step, pointerY - (viewportHeight - threshold)),
      );
      scrolled = true;
    }

    return scrolled;
  }

  private finishDrag() {
    if (!this.drag) return;

    const drag = this.drag;
    const finalOrder = drag.getOrder(this.rows);
    const movedUp: HTMLTableRowElement[] = [];
    const movedDown: HTMLTableRowElement[] = [];

    finalOrder.forEach((row, index) => {
      if (row === drag.target) return;
      const previousIndex = this.rows.indexOf(row);
      if (previousIndex > index) movedUp.push(row);
      else if (previousIndex < index) movedDown.push(row);
    });

    const draggedRow = drag.target;

    finalOrder.forEach((row) => {
      row.style.transform = "";
      row.classList.remove("dragging");
      this.tbody.appendChild(row);
    });

    this.rows = finalOrder;
    this.drag = null;
    this.updatePositionLabels(this.rows);
    this.notifyChangeIfNeeded(drag.isDragging);

    if (draggedRow) {
      draggedRow.classList.add("flash-success");
      movedUp.forEach((row) => this.applyIndicator(row, "up"));
      movedDown.forEach((row) => this.applyIndicator(row, "down"));

      this.timeout = globalThis.setTimeout(() => {
        document
          .querySelectorAll(".flash-success, .pos-up, .pos-down")
          .forEach((element) => {
            element.classList.add("fade-out");
          });

        this.timeout = globalThis.setTimeout(() => this.reset(), 500);
      }, 2000);
    }
  }

  private reset() {
    if (this.timeout) {
      globalThis.clearTimeout(this.timeout);
      this.timeout = null;
    }

    document
      .querySelectorAll(".flash-success, .pos-up, .pos-down, .fade-out")
      .forEach((element) => {
        element.classList.remove(
          "flash-success",
          "pos-up",
          "pos-down",
          "fade-out",
        );
      });
  }

  private applyIndicator(row: HTMLTableRowElement, direction: "up" | "down") {
    const cell = this.getPositionCell(row);
    if (!cell) return;
    cell.classList.remove("pos-up", "pos-down");
    cell.classList.add(direction === "up" ? "pos-up" : "pos-down");
  }

  private getPositionCell(row: HTMLTableRowElement) {
    if (this.positionCellCache.has(row)) {
      return this.positionCellCache.get(row) ?? null;
    }

    const cells = Array.from(row.querySelectorAll<HTMLTableCellElement>("td"));
    const cell = cells[1] ?? null;
    if (cell) this.positionCellCache.set(row, cell);
    return cell;
  }

  private updatePositionLabels(orderedRows: HTMLTableRowElement[]) {
    orderedRows.forEach((row, index) => {
      const cell = this.getPositionCell(row);
      const indicator = cell?.querySelector(".position-badge");
      if (indicator && indicator.textContent !== String(index + 1)) {
        indicator.textContent = String(index + 1);
      }
    });
  }

  private getRowOrderIds(rows: HTMLTableRowElement[]) {
    const ids: string[] = [];
    for (const row of rows) {
      const id = row.dataset.id;
      if (!id) return null;
      ids.push(id);
    }
    return ids;
  }

  private notifyChangeIfNeeded(didDrag: boolean) {
    if (!this.onChange || !didDrag) {
      this.dragStartOrder = null;
      return;
    }

    const previous = this.dragStartOrder;
    const current = this.getRowOrderIds(this.rows);
    this.dragStartOrder = null;
    if (!previous || !current) return;

    const hasChanged =
      previous.length !== current.length ||
      previous.some((value, index) => value !== current[index]);

    if (hasChanged) {
      this.onChange(current);
    }
  }

  private shuffleOnce() {
    this.refreshHandles();
    this.dragStartOrder = this.getRowOrderIds(this.rows);

    const fromIndex = Math.floor(Math.random() * this.rows.length);
    const toIndex = Math.floor(Math.random() * this.rows.length);

    if (fromIndex === toIndex) return;

    const newOrder = [...this.rows];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);

    const movedUp: HTMLTableRowElement[] = [];
    const movedDown: HTMLTableRowElement[] = [];

    newOrder.forEach((row, index) => {
      const previousIndex = this.rows.indexOf(row);
      if (previousIndex > index) movedUp.push(row);
      else if (previousIndex < index) movedDown.push(row);
    });

    newOrder.forEach((row) => {
      row.style.transform = "";
      row.classList.remove("dragging");
      this.tbody.appendChild(row);
    });

    const draggedRow = moved;

    this.rows = newOrder;
    this.updatePositionLabels(this.rows);

    this.notifyChangeIfNeeded(true);

    if (draggedRow) {
      draggedRow.classList.add("flash-success");
      movedUp.forEach((row) => this.applyIndicator(row, "up"));
      movedDown.forEach((row) => this.applyIndicator(row, "down"));

      this.timeout = globalThis.setTimeout(() => {
        document
          .querySelectorAll(".flash-success, .pos-up, .pos-down")
          .forEach((element) => {
            element.classList.add("fade-out");
          });

        this.timeout = globalThis.setTimeout(() => this.reset(), 500);
      }, 2000);
    }
  }

  async shuffle() {
    this.refreshHandles();
    const shuffles = this.rows.length;
    for (let i = 0; i < shuffles; i++) {
      this.shuffleOnce();
      await new Promise((resolve) => setTimeout(resolve, 1700 / shuffles));
    }
  }
}

export function sortableTable(
  node: HTMLTableSectionElement,
  options: {
    onChange?: (order: string[]) => void;
    setInternalShuffle?: (fn: () => void) => void;
  },
) {
  const sortable = new SortableTable(node, options.onChange);
  sortable.attach();
  options.setInternalShuffle?.(sortable.shuffle.bind(sortable));

  return {
    destroy() {
      sortable.detach();
    },
  };
}
