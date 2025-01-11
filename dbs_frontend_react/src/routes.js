import React from 'react'

// ADD HERE TO REGISTER YOUR PAGE
const Dashboard = React.lazy(() => import('./views/pages/Dashboard'))
const MakeRequest = React.lazy(() => import('./views/pages/MakeRequest'))
const OrderRequests = React.lazy(() => import('./views/pages/OrderRequests'))


const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/template_examples/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/template_examples/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/template_examples/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/template_examples/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/template_examples/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/template_examples/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/template_examples/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/template_examples/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/template_examples/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/template_examples/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/template_examples/base/progress/Progress'))           
const Spinners = React.lazy(() => import('./views/template_examples/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/template_examples/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/template_examples/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/template_examples/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/template_examples/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/template_examples/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/template_examples/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/template_examples/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/template_examples/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/template_examples/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/template_examples/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/template_examples/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/template_examples/forms/range/Range'))
const Select = React.lazy(() => import('./views/template_examples/forms/select/Select'))
const Validation = React.lazy(() => import('./views/template_examples/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/template_examples/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/template_examples/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/template_examples/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/template_examples/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/template_examples/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/template_examples/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/template_examples/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/template_examples/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/template_examples/widgets/Widgets'))

// ADD HERE TO REGISTER THE PAGE TO THE ROUTE
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/MakeRequest', name: 'MakeRequest', element: MakeRequest },
  { path: '/OrderRequests', name: 'OrderRequests', element: OrderRequests },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
