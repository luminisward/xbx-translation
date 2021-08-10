import Head from 'next/head'
import { Select, Radio, Form, Input, Button, message } from 'antd'
import { useRouter } from 'next/router'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request, { setToken } from '../utils/request'
import { useState, useEffect } from 'react'
import { getToken } from '../utils/request'
import jwt_decode from 'jwt-decode'

const { Option } = Select

const fetcher = (url) => fetch(url).then((res) => res.json())

const LoginForm = (props) => {
  const router = useRouter()
  const onFinish = async (values) => {
    try {
      const token = await request.get('/session', { params: values })
      setToken(token)
      router.push('/editor')
    } catch (error) {
      message.error(error.message)
    }
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
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

const RegisterForm = (props) => {
  const router = useRouter()
  const onFinish = async (values) => {
    try {
      await request.post('/user', values)
      const token = await request.get('/session', { params: values })
      setToken(token)
      router.push('/editor')
    } catch (error) {
      message.error(error.message)
    }
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
          注册
        </Button>
      </Form.Item>
    </Form>
  )
}

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const jwt = getToken()
    if (jwt) {
      const { username } = jwt_decode(jwt)
      if (username) {
        router.push('/editor')
        return
      }
    }
  }, [])

  const [formType, setFormType] = useState('login')
  return (
    <div>
      <Head>
        <title>XBX汉化协作平台</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>
          <Radio.Group value={formType} onChange={(e) => setFormType(e.target.value)} style={{ marginBottom: '24px' }}>
            <Radio.Button value="login">登录</Radio.Button>
            <Radio.Button value="register">注册</Radio.Button>
            {/* <Radio.Button value="small"></Radio.Button> */}
          </Radio.Group>

          {formType === 'login' ? (
            <LoginForm style={{ width: 400 }} />
          ) : formType === 'register' ? (
            <RegisterForm style={{ width: 400 }} />
          ) : null}
        </div>
      </main>
    </div>
  )
}
