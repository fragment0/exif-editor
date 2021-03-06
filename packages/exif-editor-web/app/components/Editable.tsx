import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`

`

interface EditableProps {
  disabled: boolean
  id: number
  value: string
  displayValue?: string
  type: string
  label: string
  onChange(id: number, value: string): void
}

interface EditableStates {
  editing: boolean
}

export default class Editable extends React.Component<EditableProps, EditableStates> {
  static defaultProps: Partial<EditableProps> = {
    type: 'text',
    disabled: false,
  }

  state: EditableStates = {editing: false}
  input: HTMLInputElement | null = null

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    this.props.onChange(this.props.id, this.input!.value)
    this.setState({editing: false})
  }

  handleFocus = () => {
    if (this.props.disabled) return
    if (this.state.editing) return
    this.setState({editing: true}, () => {
      this.input!.focus()
    })
  }

  render(): JSX.Element {
    const {type, value, label, displayValue} = this.props
    const {editing} = this.state

    return (
      <Wrapper onClick={this.handleFocus}>
        {editing ?
        <form onSubmit={this.handleSubmit}>
          <input
            defaultValue={value}
            type={type}
            onBlur={this.handleSubmit}
            ref={el => this.input = el}
            aria-label={label}
          />
        </form>
        : (displayValue || value)
        }
      </Wrapper>
    )
  }
}
