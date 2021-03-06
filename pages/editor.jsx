import { Button, Input, Modal, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import CompareTable from '../components/CompareTable'
import request from '../utils/request'
import { useRouter } from 'next/router'
import authCheck from '../utils/authCheck'
import AppLayout from '../components/AppLayout'

const { Option } = Select
const { TextArea } = Input

export default function Editor() {
  const [currentTableName, setCurrentTableName] = useState(null)

  const { data: tables } = useSWR('/bdat/all', request.get, { revalidateOnFocus: false })

  const { data: tableRowsJp } = useSWR(currentTableName ? `/bdat/${currentTableName}?language=jp` : null, request.get, {
    revalidateOnFocus: false,
  })
  const { data: tableRowsYx } = useSWR(currentTableName ? `/bdat/${currentTableName}?language=yx` : null, request.get, {
    revalidateOnFocus: false,
  })

  const { data: translation, mutate } = useSWR(
    currentTableName ? `/translation/${currentTableName}` : null,
    request.get
  )

  const [localTranslation, setLocalTranslation] = useState({})
  const handleSave = async ({ id, cn }) => {
    const row = {
      table: currentTableName,
      row_id: id,
      text: cn,
    }
    await request.put(`/translation`, row)
    setLocalTranslation({ ...localTranslation, [row.row_id]: row })
  }
  const reloadTranslation = () => mutate()

  useEffect(() => {
    setLocalTranslation({})
  }, [currentTableName, translation])

  const dataSource = []
  if (tableRowsJp && tableRowsYx && translation) {
    for (const { row_id, name } of tableRowsJp) {
      const yxText = tableRowsYx.find((row) => row_id === row.row_id)

      const translationRow = translation.find((translationRow) => translationRow.row_id === row_id)
      const localTranslationRow = localTranslation[row_id]

      dataSource.push({
        id: row_id,
        jp: name,
        yx: yxText ? yxText.name : '',
        cn: localTranslationRow?.text || translationRow?.text,
      })
    }
  }

  // const { data: languages } = useSWR(currentTableName ? `/api/languages` : null, fetcher)
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '50px',
    },
    {
      title: '??????',
      dataIndex: 'jp',
      width: '32%',
    },
    {
      title: '??????',
      dataIndex: 'yx',
      width: '32%',
    },
    {
      title: '??????',
      dataIndex: 'cn',
      editable: true,
      width: '32%',
    },
  ].map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [batchEditText, setBatchEditText] = useState('')
  const textRowsCount = batchEditText.split('\n').length

  const showModal = () => {
    setBatchEditText(dataSource.map((row) => row.cn).join('\n'))
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    await request.put(`/translation`, {
      table: currentTableName,
      text: batchEditText,
    })
    await reloadTranslation()
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <AppLayout
      navbar={
        <>
          <Select
            onChange={setCurrentTableName}
            showSearch
            style={{
              flex: 1,
            }}
          >
            {tables
              ? tables.map((tablename, index) => {
                  return (
                    <Option key={index} value={tablename}>
                      {tablename}
                    </Option>
                  )
                })
              : null}
          </Select>
          <Button type="primary" onClick={showModal} disabled={!currentTableName}>
            ????????????
          </Button>
          <Button
            style={{
              marginLeft: '1em',
            }}
            type="primary"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={reloadTranslation}
          />
        </>
      }
    >
      <CompareTable
        dataSource={dataSource}
        columns={columns}
        scroll={{ y: 'calc(100vh - 160px)' }}
        currentTableName={currentTableName}
        className="h-full  overflow-auto"
        pagination={{
          pageSizeOptions: [10, 100, 1000, 5000],
        }}
      />
      <Modal
        title="????????????"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: textRowsCount !== dataSource.length }}
        width={'70%'}
      >
        <TextArea
          value={batchEditText}
          onChange={(e) => {
            setBatchEditText(e.target.value)
          }}
          autoSize={{ minRows: 4, maxRows: 20 }}
          showCount={{
            formatter: ({ count, maxLength }) => {
              return `????????????: ${textRowsCount}\t????????????: ${dataSource.length}`
            },
          }}
        />
      </Modal>
    </AppLayout>
  )
}
