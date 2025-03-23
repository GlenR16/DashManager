import React from 'react'
import { ChartProps } from './ChartUtils'
import DataTable from 'react-data-table-component'
import Error from '../../pages/Error'

const tableStyles = {
    rows: {
        style: {
            minHeight: '52px',
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'var(--color-base-content)',
            backgroundColor: 'var(--color-base-100)',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-base-content)',
            backgroundColor: 'var(--color-base-100)',
        },
    },
}

export default function CustomTable({ graph }: ChartProps): React.ReactElement {
    const columns = graph.meta?.dataKeys?.map((dataKey: string) => {
        return {
            name: dataKey.toUpperCase().replace(/_/g, ' '),
            selector: (row: any) => row[dataKey],
            sortable: true
        }
    })

    const data = graph.data_arrays[0]?.data_points?.map((dataPoint: any) => {
        return {
            id: dataPoint.id,
            ...dataPoint.object,
            created_at: new Date(dataPoint.created_at).toLocaleString()
        }
    })

    return (
        <div className='w-full'>
            {
                graph.data_arrays.length > 0 && graph.data_arrays[0]?.data_points?.length > 0 ?
                <DataTable columns={columns} data={data} customStyles={tableStyles} />
                :
                <Error message="No data found" />
            }
        </div>
    )
}
