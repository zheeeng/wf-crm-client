import React from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

export {
  arrayMove,
}

interface ItemProps {
  element: JSX.Element,
  id?: string,
}

export const SortHandler = SortableHandle<ItemProps>(({ element }) => element)

export const SortableItem = SortableElement<ItemProps>(({ element }) => element)

interface ListProps {
  children: ItemProps[]
}

const SortableList = SortableContainer<ListProps>(({ children }) => (
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
