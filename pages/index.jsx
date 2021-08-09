import Head from 'next/head'
import Image from 'next/image'
import { Table, Tag, Space, Select, Form, Input, Button, message } from 'antd'
import { useRouter } from 'next/router'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request, { setToken } from '../utils/request'
import useSWR from 'swr'
import { useState } from 'react'
import CompareTable from '../components/CompareTable'

const { Option } = Select

const fetcher = (url) => fetch(url).then((res) => res.json())

const LoginForm = (props) => {
  const router = useRouter()
  const onFinish = async (values) => {
    console.log('Success:', values)
    try {
      const token = await request.get('/session', { params: values })
      setToken(token)
      router.push('/editor')
    } catch (error) {
      message.error(error.message)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form name="normal_login" className="login-form" onFinish={onFinish} {...props}>
      <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>XBX汉化协作平台</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen">
        <LoginForm style={{ width: 400 }} />
      </main>
    </div>
  )
}
