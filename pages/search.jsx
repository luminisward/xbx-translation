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

  const [searchCondition, setSearchCondition] = useState({ searchText: '', language: 'cn' })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const { data } = useSWR(
    searchCondition.searchText
      ? [searchCondition.searchText, searchCondition.language, pagination.current, pagination.pageSize]
      : null,
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

  const [language, setLanguage] = useState('cn')
  const handleSearchTextChange = async (text) => {
    setSearchCondition({ searchText: text, language })
  }

  const handlePaginationChange = async (pagination) => {
    setPagination(pagination)
  }

  return (
    <AppLayout
      navbar={
        <>
          <Input.Group compact style={{ display: 'flex' }}>
            <Select size="large" value={language} onChange={setLanguage}>
              <Option value="jp">日版</Option>
              <Option value="yx">游侠</Option>
              <Option value="cn">汉化</Option>
            </Select>
            <Input.Search placeholder="input search text" size="large" enterButton onSearch={handleSearchTextChange} />
          </Input.Group>
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
        loading={searchCondition.searchText && !data}
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 100, 1000, 5000],
          showTotal: (total) => `Total ${total}`,
        }}
        onChange={handlePaginationChange}
      />
    </AppLayout>
  )
}
