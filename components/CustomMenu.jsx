import { Layout, Menu, Modal } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getToken } from '../utils/request'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'

const { SubMenu } = Menu

export default function CustomMenu({ children, ...props }) {
  const router = useRouter()

  const routes = [
    { path: '/editor', label: '编辑' },
    { path: '/changes', label: '修改历史' },
  ]

  const [username, setUsername] = useState('')

  useEffect(() => {
    const jwt = getToken()
    if (jwt) {
      setUsername(jwt_decode(jwt).username)
    }
  }, [])

  const confirm = () => {
    Modal.confirm({
      title: '提示',
      content: '是否注销？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        window.localStorage.clear()
        router.push('/')
      },
    })
  }

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        inlineCollapsed={false}
        style={{
          marginRight: '3em',
        }}
        selectedKeys={[router.pathname]}
      >
        {routes.map((route) => (
          <Menu.Item key={route.path}>
            <Link href={route.path}>{route.label}</Link>
          </Menu.Item>
        ))}
      </Menu>

      {children}

      <div style={{ cursor: 'pointer', color: 'white', marginLeft: '3em' }} onClick={confirm}>
        {username}
      </div>
    </>
  )
}
