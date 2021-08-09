import useSWR from 'swr'
import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { Table, Tag, Space, Select, Form, Input, message } from 'antd'
import request from '../utils/request'

const EditableContext = createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const { cn } = await form.validateFields()
      await handleSave({ ...record, cn })
      toggleEdit()
    } catch (errInfo) {
      message.error(errInfo.message)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input.TextArea ref={inputRef} autoSize onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default function CompareTable({ dataSource, currentTableName, languages, columns, ...rest }) {
  return (
    <Table
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      bordered
      size="small"
      {...rest}
    />
  )
}
