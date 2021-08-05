import Head from 'next/head'
import Image from 'next/image'
import { Table, Tag, Space, Select } from 'antd'
import useSWR from 'swr'
import { useState } from 'react'

const { Option } = Select
const columns = [
  {
    title: 'id',
    dataIndex: 'row_id',
  },
  {
    title: '文本',
    dataIndex: 'name',
  },
]

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const [currentTableName, setCurrentTableName] = useState(null)
  const { data: tables } = useSWR('/api/table/all', fetcher)

  const { data: tableRows } = useSWR(currentTableName ? `/api/table/${currentTableName}` : null, fetcher)

  return (
    <div>
      <Head>
        <title>XBX汉化协作平台</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Select onChange={setCurrentTableName}>
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

        <Table columns={columns} dataSource={tableRows} rowKey="row_id" />
      </main>
    </div>
  )
}
