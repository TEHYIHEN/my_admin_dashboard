import { CalendarOutlined } from '@ant-design/icons'
import { Badge, Card, List } from 'antd'
import React, { useState } from 'react'
import { Text } from '../text'
import {UpcomingEventsSkeleton} from "@/components"
import { useList } from '@refinedev/core'
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries'
import { getDate } from '@/utilities/helpers'
import dayjs from 'dayjs'

const UpcomingEvents = () => {

  //const [isLoading, setIsLoading] = useState(false);

  const { result , query} = useList({  //注意这里 query:{isLoading}，查看documentation

    resource: "events",
    pagination: {
      pageSize: 5,
    },
    sorters:[
      {
        field: "startDate",
        order: "desc",
      }
    ],
    // filters:[  
    //   {
    //     field: "startDate",
    //     operator: "gte",
    //     value: dayjs().format("YYYY-MM-DD"),
    //   }
    // ],
    meta:{
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    }

  });

  return (
    <Card 
      style={{height: "100%"}}
      styles={{
        header:{padding:"8px 16px"},
        body:{padding:"0 1 rem"},
      }}
      title={
        <div 
          style={{
            display:"flex",
            alignItems:"center",
            gap:"8px"
        }}
        >
          <CalendarOutlined />
          <Text size="sm" style={{marginLeft:"0.7rem"}}/>
            Upcoming Events
        </div>
      }
      
    >
      {query.isLoading ? ( //usestate的isLoading，换成 useList的 query.isLoading
        <List
          itemLayout='horizontal'
          dataSource={Array.from({length: 5}).map((_, index)=> ({
            id: index,
          }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        >

        </List>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={result?.data || []}
          renderItem={(item: any) =>{

            const renderDate = getDate(item.startDate, item.endDate)

            return ( 
              <List.Item>
                <List.Item.Meta 
                  avatar= {<Badge color={item.color} />}
                  title={<Text size='xs'>{renderDate}</Text>}
                  description={<Text strong ellipsis={{tooltip: true}}>{item.title}</Text>}
                />
              </List.Item>
            )
          }}
        >
          {(!query.isLoading && result?.data?.length === 0) //usestate的isLoading，换成 useList的 query.isLoading
            ? (
            
                <span
                  style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:"220px",
                    fontSize: "36px",
                    fontFamily: "cursive"
                  }}
                >
                  No Upcoming Events😒
                </span>

              )
            : null
        }
        </List>
      )}

        

    </Card>
  )
}

export default UpcomingEvents
