import Head from 'next/head'
import { Button, Table, Tag, Space, Select, Layout } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import CompareTable from '../components/CompareTable'
import request from '../utils/request'
import CustomMenu from '../components/CustomMenu'
import BdatCascader from '../components/BdatCascader'
import { useRouter } from 'next/router'
import authCheck from '../utils/authCheck'

const { Option } = Select

export default function Editor() {
  const router = useRouter()
  useEffect(() => {
    authCheck(router)
  }, [])

  const [currentTable, setCurrentTable] = useState('')

  const { data: changes, mutate } = useSWR(`/changes/${currentTable}`, request.get)
  const changesDataSource =
    changes?.map((row) => {
      row.time = new Date(row.time).toLocaleString()
      return row
    }) || []

  const reloadTranslation = () => mutate()

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '20%',
    },
    {
      title: 'id',
      dataIndex: 'row_id',
      width: '10%',
    },
    {
      title: '文本',
      dataIndex: 'text',
      width: '50%',
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      width: '20%',
    },
  ]

  return (
    <div>
      <Head>
        <title>XBX汉化协作平台</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <Layout.Header
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CustomMenu>
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
            </CustomMenu>
          </Layout.Header>

          <Layout.Content className="flex-grow">
            <Table
              dataSource={changesDataSource}
              columns={columns}
              scroll={{ y: 'calc(100vh - 158px)' }}
              className="h-full  overflow-auto"
              rowKey="id"
              bordered
              size="small"
            />
          </Layout.Content>
        </Layout>
      </main>
    </div>
  )
}
