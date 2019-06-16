import React from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

export {
  arrayMove,
}

interface ItemProps {
  element: JSX.Element
  id?: string
}

export const SortHandler = SortableHandle(({ element }: ItemProps) => element)

export const SortableItem = SortableElement(({ element }: ItemProps) => element)

interface ListProps {
  children: ItemProps[]
  disabled?: boolean
}

const SortableList = SortableContainer(({ children, disabled = false }: ListProps) => (
  <div>
    {children.map((item, index) => (
      <SortableItem
        key={item.id}
        index={index}
        id={item.id}
        element={item.element}
        disabled={disabled}
      />
    ))}
  </div>
))

export default SortableList
