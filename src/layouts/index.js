import DefaultLayout from "./common/DefaultLayout.vue"
import Sidebar from "./common/SidebarLayout.vue"
import Auth from "./common/AuthLayout.vue"
import Empty from "./common/EmptyLayout.vue"

/**
 'routers/index.js'에 아래와 같이 넣으면 원하는 레이아웃으로 변경됨

 meta: { layout: "DefaultLayout" }
 meta: { layout: "Sidebar" }
 */

export const Layouts = {
    Default: DefaultLayout,
    Sidebar,
    Auth,
    Empty
}
