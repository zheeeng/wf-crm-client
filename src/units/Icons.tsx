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
import { ReactComponent as EnterIcon } from '~src/assets/icons/enter.svg'
import { ReactComponent as NoteEditIcon } from '~src/assets/icons/note-edit.svg'
import { ReactComponent as DeleteIcon } from '~src/assets/icons/delete.svg'
import { ReactComponent as AddCircleIcon } from '~src/assets/icons/add-circle.svg'
import { ReactComponent as NoteIcon } from '~src/assets/icons/note.svg'
import { ReactComponent as EyeIcon } from '~src/assets/icons/eye.svg'
import { ReactComponent as ReorderIcon } from '~src/assets/icons/reorder.svg'
import { ReactComponent as NameIcon } from '~src/assets/icons/name.svg'
import { ReactComponent as EmailIcon } from '~src/assets/icons/email.svg'
import { ReactComponent as PhoneIcon } from '~src/assets/icons/phone.svg'
import { ReactComponent as GenderIcon } from '~src/assets/icons/gender.svg'
import { ReactComponent as BirthdayIcon } from '~src/assets/icons/birthday.svg'
import { ReactComponent as LocationIcon } from '~src/assets/icons/location.svg'
import { ReactComponent as DescriptionIcon } from '~src/assets/icons/description.svg'
import { ReactComponent as WaiverIcon } from '~src/assets/icons/waiver.svg'
import { ReactComponent as SplitIcon } from '~src/assets/icons/split.svg'
import { ReactComponent as DownloadIcon } from '~src/assets/icons/download.svg'
import { ReactComponent as TagIcon } from '~src/assets/icons/tag.svg'
import { ReactComponent as SearchIcon } from '~src/assets/icons/search.svg'
import { ReactComponent as CloseIcon } from '~src/assets/icons/close.svg'

import { ReactComponent as ArrowLeftIcon } from '~src/assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRightIcon } from '~src/assets/icons/arrow-right.svg'
import { ReactComponent as ArrowUpIcon } from '~src/assets/icons/arrow-up.svg'
import { ReactComponent as ArrowDownIcon } from '~src/assets/icons/arrow-down.svg'

import { ReactComponent as LoadingIcon } from '~src/assets/loading.svg'

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
  Enter,
  NoteEdit,
  Delete,
  AddCircle,
  Note,
  Eye,
  Reorder,
  Name,
  Email,
  Phone,
  Gender,
  Birthday,
  Location,
  Description,
  Waiver,
  Split,
  Download,
  Tag,
  Search,
  Close,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Loading,
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
    case ICONS.Enter:
      return EnterIcon
    case ICONS.NoteEdit:
      return NoteEditIcon
    case ICONS.Delete:
      return DeleteIcon
    case ICONS.AddCircle:
      return AddCircleIcon
    case ICONS.Note:
      return NoteIcon
    case ICONS.Eye:
      return EyeIcon
    case ICONS.Reorder:
      return ReorderIcon
    case ICONS.Name:
      return NameIcon
    case ICONS.Email:
      return EmailIcon
    case ICONS.Phone:
      return PhoneIcon
    case ICONS.Gender:
      return GenderIcon
    case ICONS.Birthday:
      return BirthdayIcon
    case ICONS.Location:
      return LocationIcon
    case ICONS.Description:
      return DescriptionIcon
    case ICONS.Waiver:
      return WaiverIcon
    case ICONS.Split:
      return SplitIcon
    case ICONS.Download:
      return DownloadIcon
    case ICONS.Tag:
      return TagIcon
    case ICONS.Search:
      return SearchIcon
    case ICONS.Close:
      return CloseIcon
    case ICONS.ArrowLeft:
      return ArrowLeftIcon
    case ICONS.ArrowRight:
      return ArrowRightIcon
    case ICONS.ArrowUp:
      return ArrowUpIcon
    case ICONS.ArrowDown:
      return ArrowDownIcon
    case ICONS.Loading:
      return LoadingIcon
    default:
      return () => null
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  svgIcon: {
    ...cssTips(theme, { svgIconFactor: 2.5 }).svgIcon(),
    transition: 'color .3s',
  },
  primaryColorIcon: {
    color: theme.palette.primary.main,
  },
  secondaryColorIcon: {
    color: theme.palette.secondary.main,
  },
  disabledIcon: {
    color: theme.palette.grey[700],
  },
  hoverLightenIcon: {
    color: theme.palette.secondary.main,
    ...{
      '&:hover': {
        color: theme.palette.text.primary,
      },
      '&:active': {
        color: theme.palette.primary.main,
      },
    },
  },
  xlIcon : {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
  lgIcon : {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  mdIcon : {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
  smIcon : {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  xsIcon: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
  }
}))

export interface Props {
  name: ICONS
  className?: string
  color?: 'primary' | 'secondary' | 'disabled' | 'hoverLighten'
  size?: 'md' | 'sm' | 'xs' | 'lg' | 'xl'
  onClick?: React.MouseEventHandler<SVGElement>
  onMouseEnter?: React.MouseEventHandler<SVGElement>
  onMouseLeave?: React.MouseEventHandler<SVGElement>
  style?: React.CSSProperties
}

const SvgIcon: React.FC<Props> = React.memo(({ name, style, className, color /*= 'primary'*/, size /*= 'md'*/, onClick, onMouseEnter, onMouseLeave }) => {
  const classes = useStyles({})

  const clsName = classnames(
    classes.svgIcon,
    {
      primary: classes.primaryColorIcon,
      secondary: classes.secondaryColorIcon,
      disabled: classes.disabledIcon,
      hoverLighten: classes.hoverLightenIcon
    }[color || 'primary'],
    {
      xl: classes.xlIcon,
      lg: classes.lgIcon,
      md: classes.mdIcon,
      sm: classes.smIcon,
      xs: classes.xsIcon,
    }[size || 'md'],
    className
  )

  const Comp = getIcon(name)

  return (
    <Comp style={style} className={clsName} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
  )
})

export default SvgIcon
