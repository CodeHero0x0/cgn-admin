import {useUserStore} from './modules/user'
import {useRouterStore} from './modules/router'
import {useAppStore} from './modules/app'
import {useTabsStore} from './modules/tabs'

const store: any = {}

export const registerStore = () => {
    store.userStore = useUserStore()
    store.routerStore = useRouterStore()
    store.appStore = useAppStore()
    store.tabsStore = useTabsStore()
}

export default store
