import Head from 'next/head'
import Image from 'next/image'
import { Button, Table, Tag, Space, Select, Layout } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import CompareTable from '../components/CompareTable'
import request from '../utils/request'
import CustomMenu from '../components/CustomMenu'
import { useRouter } from 'next/router'
import authCheck from '../utils/authCheck'

const { Option } = Select

export default function Editor() {
  const router = useRouter()
  useEffect(() => {
    authCheck(router)
  }, [])

  const [currentTableName, setCurrentTableName] = useState(null)

  const { data: tables } = useSWR('/bdat/all', request.get, { revalidateOnFocus: false })

  const { data: tableRowsJp } = useSWR(currentTableName ? `/bdat/${currentTableName}?language=jp` : null, request.get, {
    revalidateOnFocus: false,
  })
  const { data: tableRowsYx } = useSWR(currentTableName ? `/bdat/${currentTableName}?language=yx` : null, request.get, {
    revalidateOnFocus: false,
  })
  const { data: tableRowsCn } = useSWR(currentTableName ? `/bdat/${currentTableName}?language=cn` : null, request.get, {
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
  if (tableRowsJp && tableRowsYx && tableRowsCn && translation) {
    for (const { row_id, name } of tableRowsJp) {
      const yxText = tableRowsYx.find((row) => row_id === row.row_id)
      const cnText = tableRowsCn.find((row) => row_id === row.row_id)

      const translationRow = translation.find((translationRow) => translationRow.row_id === row_id)
      const localTranslationRow = localTranslation[row_id]

      dataSource.push({
        id: row_id,
        jp: name,
        yx: yxText ? yxText.name : '',
        cn: localTranslationRow?.text || translationRow?.text || cnText.name,
      })
    }
  }

  // const { data: languages } = useSWR(currentTableName ? `/api/languages` : null, fetcher)
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '4%',
    },
    {
      title: '日文',
      dataIndex: 'jp',
      width: '32%',
    },
    {
      title: '游侠',
      dataIndex: 'yx',
      width: '32%',
    },
    {
      title: '翻译',
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
              <Select
                onChange={setCurrentTableName}
                showSearch
                style={{
                  flex: 1,
                  marginLeft: '1em',
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
            <CompareTable
              dataSource={dataSource}
              columns={columns}
              scroll={{ y: 'calc(100vh - 158px)' }}
              currentTableName={currentTableName}
              className="h-full  overflow-auto"
              pagination={{
                pageSizeOptions: [10, 100, 1000, 5000],
              }}
            />
          </Layout.Content>
        </Layout>
      </main>
    </div>
  )
}
