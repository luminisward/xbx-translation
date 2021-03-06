import Head from 'next/head'
import CustomMenu from './CustomMenu'
import { Layout } from 'antd'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import authCheck from '../utils/authCheck'

export default function AppLayout({ navbar, children, ...rest }) {
  const router = useRouter()
  useEffect(() => {
    authCheck(router)
  }, [])

  return (
    <div>
      <Head>
        <title>XBX汉化平台</title>
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
            <CustomMenu>{navbar}</CustomMenu>
          </Layout.Header>

          <Layout.Content className="flex-grow" {...rest}>
            {children}
          </Layout.Content>
        </Layout>
      </main>
    </div>
  )
}
