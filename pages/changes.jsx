import { Button, Table, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import request from '../utils/request'
import BdatCascader from '../components/BdatCascader'
import { useRouter } from 'next/router'
import authCheck from '../utils/authCheck'
import AppLayout from '../components/AppLayout'

const { Option } = Select

export default function Editor() {
  const [currentTable, setCurrentTable] = useState('')

  const { data: changes, mutate } = useSWR(`/changes/${currentTable}`, request.get)
  const changesDataSource =
    changes?.map((row) => {
      return { ...row, time: new Date(row.time).toLocaleString() }
    }) || []

  const reloadTranslation = () => mutate()

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '180px',
    },
    {
      title: 'table',
      dataIndex: 'table',
      width: '300px',
    },
    {
      title: 'id',
      dataIndex: 'row_id',
      width: '70px',
    },
    {
      title: '文本',
      dataIndex: 'text',
      // width: '50%',
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      width: '100px',
    },
  ]

  return (
    <AppLayout
      navbar={
        <>
          <BdatCascader
            onChange={(value) => {
              setCurrentTable(value.join('/'))
            }}
            style={{
              flex: 1,
            }}
          />
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
      <Table
        dataSource={changesDataSource}
        columns={columns}
        scroll={{ y: 'calc(100vh - 158px)' }}
        className="h-full  overflow-auto"
        rowKey="id"
        bordered
        size="small"
      />
    </AppLayout>
  )
}
