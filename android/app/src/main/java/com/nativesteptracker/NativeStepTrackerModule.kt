package com.nativesteptracker

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import android.util.Log

class NativeStepTrackerModule(reactContext: ReactApplicationContext) : NativeStepTrackerSpec(reactContext) {
    private val reactApplicationContext = reactContext
    private var sensorManager: SensorManager? = null
    private var stepListener: SensorEventListener? = null
    private var isTracking = false
    private var initialStepCount: Float? = null
    private var stepSensor: Sensor? = null

    override fun isStepTrackingAvailable(): Boolean? {
        if (sensorManager == null) {
            sensorManager = reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
        }
        
        stepSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
        if (stepSensor == null) {
            stepSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)
        }
        if (stepSensor == null) {
            stepSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        }
        
        val isAvailable = stepSensor != null
        Log.d("NativeStepTracker", "Step tracking available: $isAvailable, sensor type: ${stepSensor?.type}")
        return isAvailable
    }

    override fun startStepTracking() {
        if (isTracking) return
        if (sensorManager == null) {
            sensorManager = reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
        }
        
        if (stepSensor == null) {
            isStepTrackingAvailable()
        }
        
        stepSensor?.let { sensor ->
            initialStepCount = null
            stepListener = object : SensorEventListener {
                override fun onSensorChanged(event: SensorEvent) {
                    when (sensor.type) {
                        Sensor.TYPE_STEP_COUNTER -> {
                            if (initialStepCount == null) {
                                initialStepCount = event.values[0]
                                Log.d("NativeStepTracker", "Initial step count: $initialStepCount")
                            }
                            val steps = (event.values[0] - (initialStepCount ?: 0f)).toInt()
                            Log.d("NativeStepTracker", "Step counter: ${event.values[0]}, steps: $steps")
                            if (steps > 0) {
                                val eventData: ReadableMap = Arguments.createMap().apply {
                                    putInt("stepCount", steps)
                                }
                                emitOnStepUpdated(eventData)
                            }
                        }
                        Sensor.TYPE_STEP_DETECTOR -> {
                            if (event.values[0] == 1f) {
                                Log.d("NativeStepTracker", "Step detected!")
                                val eventData: ReadableMap = Arguments.createMap().apply {
                                    putInt("stepCount", 1)
                                }
                                emitOnStepUpdated(eventData)
                            }
                        }
                        Sensor.TYPE_ACCELEROMETER -> {
                            val x = event.values[0]
                            val y = event.values[1]
                            val z = event.values[2]
                            val acceleration = Math.sqrt((x * x + y * y + z * z).toDouble())
                            
                            if (acceleration > 12.0) { 
                                Log.d("NativeStepTracker", "Step detected by accelerometer: $acceleration")
                                val eventData: ReadableMap = Arguments.createMap().apply {
                                    putInt("stepCount", 1)
                                }
                                emitOnStepUpdated(eventData)
                            }
                        }
                    }
                }
                override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
                    Log.d("NativeStepTracker", "Sensor accuracy changed: $accuracy")
                }
            }
            
            val delay = when (sensor.type) {
                Sensor.TYPE_STEP_COUNTER -> SensorManager.SENSOR_DELAY_NORMAL
                Sensor.TYPE_STEP_DETECTOR -> SensorManager.SENSOR_DELAY_NORMAL
                Sensor.TYPE_ACCELEROMETER -> SensorManager.SENSOR_DELAY_UI
                else -> SensorManager.SENSOR_DELAY_NORMAL
            }
            
            val success = sensorManager?.registerListener(stepListener, sensor, delay) ?: false
            if (success) {
                isTracking = true
                Log.d("NativeStepTracker", "Step tracking started successfully with sensor: ${sensor.type}")
            } else {
                Log.e("NativeStepTracker", "Failed to register sensor listener")
            }
        } ?: run {
            Log.e("NativeStepTracker", "No step sensor available")
        }
    }

    override fun stopStepTracking() {
        if (!isTracking) return
        sensorManager?.unregisterListener(stepListener)
        stepListener = null
        initialStepCount = null
        isTracking = false
        Log.d("NativeStepTracker", "Step tracking stopped")
    }

    companion object {
        const val NAME = "NativeStepTracker"
    }
}