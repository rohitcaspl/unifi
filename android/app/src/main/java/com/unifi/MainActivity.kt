package com.everysign

import android.os.Bundle
import android.content.Intent
import android.content.res.Configuration
import expo.modules.ReactActivityDelegateWrapper
import org.devio.rn.splashscreen.SplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript.
   * Make sure this string exactly matches the component name registered in your JS entry file.
   */
  override fun getMainComponentName(): String = "everysign"

  override fun onCreate(savedInstanceState: Bundle?) {
    // Show the splash screen using your defined theme.
    SplashScreen.show(this, R.style.SplashTheme, true)
    // Pass null to super.onCreate if your RN configuration requires it.
    super.onCreate(null)
  }

  /**
   * Broadcast configuration changes (e.g. orientation) to the JS side.
   */
  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    val intent = Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    sendBroadcast(intent)
  }

  /**
   * Wrap the default ReactActivityDelegate with Expo's ReactActivityDelegateWrapper
   * to ensure proper integration with Expo modules.
   * The DefaultReactActivityDelegate uses the fabricEnabled flag from the new architecture entry.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    ReactActivityDelegateWrapper(
      this,
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    )
}
