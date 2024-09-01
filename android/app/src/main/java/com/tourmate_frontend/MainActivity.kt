package com.tourmate_frontend

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "tourmate_frontend"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [ReactActivityDelegate]
   * which allows us to enable New Architecture with a single boolean flag [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : ReactActivityDelegate(this, mainComponentName) {
        override fun createRootView(): ReactRootView {
          return RNGestureHandlerEnabledRootView(this@MainActivity)
        }
      }
}
