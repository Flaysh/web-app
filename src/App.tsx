import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import config from '@src/Config'
import AccountContextProvider from '@contexts/AccountContext'
import SpaceContextProvider from '@contexts/SpaceContext'
import UserContextProvider from '@contexts/UserContext'
import PostContextProvider from '@contexts/PostContext'
// import SidebarSmall from '@components/SidebarSmall'
import HomePage from '@pages/HomePage'
import FeaturesPage from '@pages/FeaturesPage'
import CoopPage from '@pages/CoopPage'
import SpacePage from '@pages/SpacePage/SpacePage'
import PostPage from '@pages/PostPage/PostPage'
import UserPage from '@pages/UserPage/UserPage'
import PageNotFound from '@pages/PageNotFound'
import Navbar from '@components/Navbar'
import Modals from '@components/Modals'
import styles from '@styles/App.module.scss'

const App = (): JSX.Element => {
    // todo: create <ContextProviders> component to wrap all contexts

    return (
        <div className={styles.wrapper}>
            <BrowserRouter history={createBrowserHistory}>
                <AccountContextProvider>
                    <SpaceContextProvider>
                        <UserContextProvider>
                            <PostContextProvider>
                                <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
                                    <Modals />
                                    <Navbar />
                                    {/* <div className={styles.sidebarSmallWrapper}>
                                        <SidebarSmall />
                                    </div> */}
                                    <Switch>
                                        <Route path='/' exact component={HomePage} />
                                        <Route path='/features' exact component={FeaturesPage} />
                                        <Route path='/coop' exact component={CoopPage} />
                                        <Route path='/s/:spaceHandle' component={SpacePage} />
                                        <Route path='/p/:postId' component={PostPage} />
                                        <Route path='/u/:userHandle' component={UserPage} />
                                        <Route component={PageNotFound} />
                                    </Switch>
                                </GoogleReCaptchaProvider>
                            </PostContextProvider>
                        </UserContextProvider>
                    </SpaceContextProvider>
                </AccountContextProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
