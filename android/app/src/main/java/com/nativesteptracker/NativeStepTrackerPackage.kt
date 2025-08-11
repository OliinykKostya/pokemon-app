package com.nativesteptracker

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeStepTrackerPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule =
    if (name == NativeStepTrackerModule.NAME) {
        NativeStepTrackerModule(reactContext)
    } else {
      throw IllegalArgumentException("Unknown module: $name")
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
        NativeStepTrackerModule.NAME to ReactModuleInfo(
        name = NativeStepTrackerModule.NAME,
        className = NativeStepTrackerModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}