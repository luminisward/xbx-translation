import { Cascader } from 'antd'
import { useEffect, useState } from 'react'
import request from '../utils/request'

const LazyOptions = ({ onChange, ...props }) => {
  const [options, setOptions] = useState([])
  useEffect(() => {
    async function fetchData() {
      const tables = await request.get('/bdat/all')
      setOptions(
        tables.map((table) => {
          return {
            value: table,
            label: table,
            isLeaf: false,
          }
        })
      )
    }
    fetchData()
  }, [])

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    const rows = await request.get(`/bdat/${selectedOptions[0].value}`)

    targetOption.loading = false
    targetOption.children = rows.map((row) => ({
      label: row.row_id,
      value: row.row_id,
    }))

    setOptions([...options])
  }

  return <Cascader options={options} loadData={loadData} onChange={onChange} changeOnSelect {...props} />
}

export default LazyOptions
