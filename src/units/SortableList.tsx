import React from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove, WrappedComponent, Config } from 'react-sortable-hoc'

export {
  arrayMove,
}

interface ItemProps {
  element: JSX.Element,
  id?: string,
}

export const SortHandler = SortableHandle(({ element }: ItemProps) => element)

export const SortableItem = SortableElement(({ element }: ItemProps) => element)

interface ListProps {
  children: ItemProps[]
}

const SortableList = SortableContainer(({ children }: ListProps) => (
  <div>
    {children.map((item, index) => (
      <SortableItem
        key={item.id}
        index={index}
        id={item.id}
        element={item.element}
      />
    ))}
  </div>
))

export default SortableList
