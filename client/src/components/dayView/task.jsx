import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { TimePicker } from '@material-ui/pickers'
import Transportation from '../Transportation'
import EditableContainer from '../editableContainer'
import MomentAdapter from '@date-io/moment'
const Moment = new MomentAdapter();
const { moment } = Moment

const Container = styled.div`

`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    marginLeft: 'auto',

  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function(props) {

  const classes = useStyles();

  const handleExpandClick = () => {
    props.setExpanded(!props.expanded);
  };
  const [startTime, setStartTime] = useState(moment(props.state.tasks[props.task.id].time.start, 'YYYY-MM-DD HH:mm:ss'))
  const [endTime, setEndTime] = useState(moment(props.state.tasks[props.task.id].time.end, 'YYYY-MM-DD HH:mm:ss'))
  console.log('task init', startTime, endTime, 'd:', props.task.id)
  const onTimeChange = (start, end) => {

    return props.setDayState(prev => {
      let newState = { ...prev }
      newState.tasks[props.task.id].time = { start: start, end: end }
      console.log('newstate', start, end, 'd:', props.task.id)
      return newState
    })

  }
  useEffect(() => {

    onTimeChange(moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
      moment(endTime).format('YYYY-MM-DD HH:mm:ss'))
    console.log(props.state.tasks, 'useEffect')
  }, [startTime, endTime])


  return (
    <Draggable draggableId={props.task.id.toString()} index={props.index}>
      {(provided, snapshot) => (
        <Container className='location'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card className={classes.root}>
            <CardHeader
              title={props.task.name}
              subheader="Activity"
            />
            {'Start'}
            <TimePicker value={startTime} onChange={setStartTime} />
            {'End'}
            <TimePicker value={endTime} onChange={setEndTime} />

            <i onClick={() => props.setDayState(prev => {
              console.log('clicked')
              let newState = { ...prev }
              delete newState.tasks[props.task.id]
              return (newState)
            })}>
              <DeleteForeverIcon />
            </i>
            <div>

              <p>
                {moment(startTime).format('hh:mm')}

              </p>
              <p>
                {moment(endTime).format('hh:mm')}

              </p>
            </div>

            <CardMedia
            //add pictures
            />
            <CardContent>
              <EditableContainer setDayState={props.setDayState} state={props.state} children={props.task.activity} id={props.task.id} />
            </CardContent>
            <CardActions disableSpacing>
              <span>Travel</span>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: props.expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={props.expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={props.expanded} timeout="auto" unmountOnExit exit={props.exit}>
              <CardContent>

                {/* displays travel information */}
                <Transportation travel={props.task.travel} setDayState={props.setDayState} task={props.task} />

              </CardContent>
            </Collapse>
          </Card>
        </Container>
      )}
    </Draggable>
  )
}