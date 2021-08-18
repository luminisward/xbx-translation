import Head from 'next/head'
import { Button, Table, Tag, Space, Select, Layout, List, Upload, message } from 'antd'
import { ReloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
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

  const { data: tables } = useSWR('/bdat/all', request.get, { revalidateOnFocus: false })
  const tablePrefixs = tables?.map((table) => table.split('.')[0]) || []
  const tablePrefixsSet = Array.from(new Set(tablePrefixs))

  const [fileList, setFileList] = useState([])
  const [currentTableName, setCurrentTableName] = useState(null)

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([file])
      return false
    },
    fileList,
  }

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
            <CustomMenu></CustomMenu>
          </Layout.Header>

          <Layout.Content style={{ overflow: 'auto' }}>
            <h2>导入</h2>
            <p>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              <Button
                onClick={async () => {
                  const formData = new FormData()
                  fileList.forEach((file) => {
                    formData.append('file', file)
                  })
                  const result = await request.post('/excel', formData)
                  message.info(result)
                }}
                type="primary"
                style={{ marginTop: 16 }}
              >
                导入
              </Button>
            </p>
            <h2>导出</h2>
            <p>
              <Select
                onChange={setCurrentTableName}
                showSearch
                style={{
                  width: 300,
                }}
              >
                {tablePrefixsSet
                  ? tablePrefixsSet.map((tablename, index) => {
                      return (
                        <Option key={index} value={tablename}>
                          {tablename}
                        </Option>
                      )
                    })
                  : null}
              </Select>
              <div>
                <Button
                  type="primary"
                  href={`${process.env.NEXT_PUBLIC_API_BASE}/excel/${currentTableName}`}
                  disabled={fileList.length === 0}
                  style={{ marginTop: 16 }}
                >
                  导出
                </Button>
              </div>
            </p>
          </Layout.Content>
        </Layout>
      </main>
    </div>
  )
}
