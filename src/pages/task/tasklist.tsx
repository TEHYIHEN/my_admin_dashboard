import { KanbanBoard, KanbanBoardContainer } from '@/components/tasks/kanban/board'
import ProjectCard from '@/components/tasks/kanban/card'
import KanbanColumn from '@/components/tasks/kanban/column'
import KanbanItem from '@/components/tasks/kanban/kanban'
import { TASK_STAGES_QUERY, TASKS_QUERY } from '@/graphql/queries'
import { TaskStage } from '@/graphql/schema.types'
import { TasksQuery } from '@/graphql/types'
import { useList } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import React from 'react'

const TaskList = () => {

  const {result:stagesResult, query:{isLoading: isLoadingStage}} =useList<TaskStage>({

    resource: "taskStages",
    filters:[
      {
        field: "title",
        operator: "in",
        value:["TODO","IN PROGRESS","IN REVIEW","DONE"],
      }
    ],
    sorters:[
      {
        field:"createdAt",
        order:"asc"
      }
    ],
    meta:{
      gqlQuery: TASK_STAGES_QUERY
    }

  });

  const {result:tasksResult , query:{isLoading: isLoadingTasks} } = useList<GetFieldsFromList<TasksQuery>>({

    resource:"tasks",
    sorters:[
      {
        field:"dueDate",
        order:"asc"
      }
    ],
    /*
        !! meaning 强制任何值转换为Boolean， if stagesResult = null / undefined / 0 / "" / NaN / false , result = false
        if stagesResult have any value, then result = true
    
    */
    queryOptions:{enabled: !!stagesResult}, 
    pagination:{mode:"off"},
    meta:{
      gqlQuery:TASKS_QUERY
    }

  })

  //console.log(tasksResult);

  const taskStages = React.useMemo(()=> {

    if (!tasksResult?.data || !stagesResult?.data){
      return{
        
        unnasignedStage: [],
        stagesResults: [] 
      }
    }

    const unnasignedStage = tasksResult.data.filter((task)  => task.stageId === null);
    const grouped: TaskStage[] = stagesResult.data.map((stage) => ({
      ...stage,
      tasks: tasksResult.data.filter((task) => task.stageId?.toString() === stage.id)

    }))

    return {
      unnasignedStage,
      stagesResults: grouped
    }


  }, [stagesResult, tasksResult]);

  const handleAddCard = (args:{ stageId: string }) => {


  }

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
            <KanbanColumn
              id="unnasigned"
              title={"unassigned"}
              count={taskStages.unnasignedStage.length || 0}
              onAddClick={() => handleAddCard({stageId:"unnasigned"})}
            >
                {taskStages.unnasignedStage.map((task)=> (
                  <KanbanItem key={task.id} id={task.id} data={{...task, stageId:"unnasigned"}}>
                    <ProjectCard 
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>

                ))}

                  {!taskStages.unnasignedStage.length && (
                    <KanbanAddCardButton onClick={()=> handleAddCard({stageId:"unnasigned"})} />
                  )}
            </KanbanColumn>    
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  )
}

export default TaskList
