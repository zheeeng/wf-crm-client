import React from 'react'
import classnames from 'classnames'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import cssTips from '~src/utils/cssTips'

import { ReactComponent as ContactIcon } from '~src/assets/icons/contact.svg'
import { ReactComponent as AllIcon } from '~src/assets/icons/all.svg'
import { ReactComponent as StarredIcon } from '~src/assets/icons/starred.svg'
import { ReactComponent as GroupIcon } from '~src/assets/icons/group.svg'

import { ReactComponent as StarStrokeIcon } from '~src/assets/icons/star-stroke.svg'
import { ReactComponent as StarIcon } from '~src/assets/icons/star.svg'
import { ReactComponent as MergeIcon } from '~src/assets/icons/merge.svg'
import { ReactComponent as ExportIcon } from '~src/assets/icons/export.svg'
import { ReactComponent as PersonAddIcon } from '~src/assets/icons/person-add.svg'
import { ReactComponent as CheckCircleIcon } from '~src/assets/icons/check-circle.svg'
import { ReactComponent as CheckIcon } from '~src/assets/icons/check.svg'
import { ReactComponent as CheckCheckedIcon } from '~src/assets/icons/check-checked.svg'
import { ReactComponent as DownloadPluginIcon } from '~src/assets/icons/download-plugin.svg'

import { ReactComponent as AddIcon } from '~src/assets/icons/add.svg'
import { ReactComponent as ChevronRightIcon } from '~src/assets/icons/chevron-right.svg'
import { ReactComponent as ChevronDownIcon } from '~src/assets/icons/chevron-down.svg'
import { ReactComponent as EditIcon } from '~src/assets/icons/edit.svg'
import { ReactComponent as DeleteIcon } from '~src/assets/icons/delete.svg'

export enum ICONS {
  SideContact,
  SideAll,
  SideStarred,
  SideGroup,
  StarStroke,
  Star,
  Merge,
  Export,
  PersonAdd,
  Check,
  CheckChecked,
  CheckCircle,
  DownloadPlugin,
  Add,
  ChevronRight,
  ChevronDown,
  Edit,
  Delete,
}

const getIcon = (icon: ICONS): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  switch (icon) {
    case ICONS.SideContact:
      return ContactIcon
    case ICONS.SideAll:
      return AllIcon
    case ICONS.SideStarred:
      return StarredIcon
    case ICONS.SideGroup:
      return GroupIcon
    case ICONS.StarStroke:
      return StarStrokeIcon
    case ICONS.Star:
      return StarIcon
    case ICONS.Merge:
      return MergeIcon
    case ICONS.Export:
      return ExportIcon
    case ICONS.PersonAdd:
      return PersonAddIcon
    case ICONS.Check:
      return CheckIcon
    case ICONS.CheckChecked:
      return CheckCheckedIcon
    case ICONS.CheckCircle:
      return CheckCircleIcon
    case ICONS.DownloadPlugin:
      return DownloadPluginIcon
    case ICONS.Add:
      return AddIcon
    case ICONS.ChevronRight:
      return ChevronRightIcon
    case ICONS.ChevronDown:
      return ChevronDownIcon
    case ICONS.Edit:
      return EditIcon
    case ICONS.Delete:
      return DeleteIcon
    default:
      return () => null
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  svgIcon: {
    ...cssTips(theme, { svgIconFactor: 2.5 }).svgIcon(),
  },
  primaryColorIcon: {
    color: theme.palette.primary.main,
  },
  secondaryColorIcon: {
    color: theme.palette.secondary.main,
  },
  hoverLightenIcon: {
    color: theme.palette.secondary.main,
    transition: 'color all .3s',
    ...{
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  },
  mdIcon : {
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
  },
  smIcon : {
    width: theme.spacing.unit * 2.5,
    height: theme.spacing.unit * 2.5,
  },
  xsIcon: {
    width: theme.spacing.unit * 2,
    height: theme.spacing.unit * 2,
  }
}))

export interface Props {
  name: ICONS,
  className?: string,
  color?: 'primary' | 'secondary' | 'hoverLighten',
  size?: 'md' | 'sm' | 'xs',
  onClick?: React.MouseEventHandler<SVGSVGElement>,
}

const SvgIcon: React.FC<Props> = React.memo(({ name, className, color = 'primary', size = 'md', onClick }) => {
  const classes = useStyles({})

  const clsName = classnames(
    classes.svgIcon,
    color === 'primary'
      ? classes.primaryColorIcon
      : color === 'secondary'
        ?classes.secondaryColorIcon
        : color === 'hoverLighten'
          ? classes.hoverLightenIcon
          : '',
    size === 'md'
      ? classes.mdIcon
      : size === 'md'
        ? classes.smIcon
        : size === 'xs'
          ? classes.xsIcon
          : '',
     className
  )

  const Comp = getIcon(name)

  return (
    <Comp className={clsName} onClick={onClick} />
  )
})

export default SvgIcon
