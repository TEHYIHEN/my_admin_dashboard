import { DollarOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Text } from '../text'
import {Area, AreaConfig} from "@ant-design/plots"
import { useList } from '@refinedev/core'
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries'
import { mapDealsData } from '@/utilities/helpers'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { DashboardDealsChartQuery } from '@/graphql/types'

const DealsChart = () => {

  const {result} = useList<GetFieldsFromList<DashboardDealsChartQuery>>({

    resource:"dealStages",
    filters:[
      {
        field:"title",
        operator:"in",
        value:["WON", "LOST"]
      }
    ],
    meta:{
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY
    }

  });

  //console.log(result?.data);

  const dealData= React.useMemo(() => {

    return mapDealsData(result?.data);

  }, [result?.data])

  const config: AreaConfig = {
    data: dealData,
    xField:"timeText",
    yField:"value",
    stack: false,
    seriesField:"state",
    shapeField:"smooth",
    colorField:"state",
    style: {
      fillOpacity: 0.2,
    },
    line:{
      style:{
        lineWidth: 2,
        fillOpacity: 1,
      },
      
    },
    scale:{
      x:{
        range:[0.03, 0.97]
      },
    },
    axis:{

        x:{
          
        },
        y:{
          gridLineWidth: 2,
          labelFormatter: (v:string) => {
            return `$${Number(v) / 1000}k`
          },
          tickCount: 10,
          tick:false,
          
        }
    },
    
    legend:{
      shape:{
        itemMarker: "square",
      }
    },

    tooltip:{
      channel: "y",
      valueFormatter: (d) => {
        return `$${(Number(d) / 1000).toFixed(1)}k`
        
      }

    },
    
    
  };

  


  return (
    <Card
      style={{height:"100%"}}
      styles={{
        header:{padding:"8px 16px"},
        body:{padding:"24px 24px 0 24px"}
      }}
      title={
        <div
          style={{
            display:"flex",
            alignItems:"center",
            gap:"8px"
          }}
        >
          <DollarOutlined />
          <Text size="sm" style={{marginLeft:"0.5rem"}}>Deals</Text>
        </div>
      }
    >
      <Area {...config} height={325}/>
    </Card>
  )
}

export default DealsChart
