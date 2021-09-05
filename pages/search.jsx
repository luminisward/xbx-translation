import { Input, Table, Select } from 'antd'
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
  const columns = [
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
      dataIndex: 'name',
      // width: '50%',
    },
  ]

  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const { data } = useSWR(
    searchText ? [searchText, 'cn', pagination.current, pagination.pageSize] : null,
    (text, language, page, limit) => request.get(`/search/bdat`, { params: { text, language, page, limit } }),
    { revalidateOnFocus: false }
  )

  const [total, setTotal] = useState(0)
  const [items, setItems] = useState([])
  useEffect(() => {
    console.log(data)
    if (data) {
      setTotal(data.meta.totalItems)
      setItems(data.items)
    }
  }, [data])

  const handleSearchTextChange = async (text) => {
    setSearchText(text)
  }

  const handlePaginationChange = async (pagination) => {
    setPagination(pagination)
  }

  return (
    <AppLayout
      navbar={
        <>
          <Input.Search placeholder="input search text" size="large" enterButton onSearch={handleSearchTextChange} />
        </>
      }
    >
      <Table
        dataSource={items}
        columns={columns}
        scroll={{ y: 'calc(100vh - 158px)' }}
        className="h-full  overflow-auto"
        rowKey={(record) => `${record.table}:${record.row_id}`}
        bordered
        size="small"
        loading={searchText && !data}
        pagination={{ ...pagination, total }}
        onChange={handlePaginationChange}
      />
    </AppLayout>
  )
}
