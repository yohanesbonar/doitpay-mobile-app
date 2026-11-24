package co.doitpay.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import android.telecom.TelecomManager
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class CallStateModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isObserving = false
  private var lastCallState: Boolean? = null
  private var phoneStateListener: PhoneStateListener? = null

  override fun getName() = "CallStateModule"

  @ReactMethod
  fun getCallState(promise: Promise) {
    try {
      promise.resolve(isCallActive())
    } catch (error: SecurityException) {
      promise.reject("PHONE_STATE_PERMISSION", "Phone state permission is required", error)
    }
  }

  @ReactMethod
  fun addListener(eventName: String) {
    // Required by NativeEventEmitter. Observation starts only when JS subscribes.
    if (eventName == "callStateChanged") startObserving()
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    if (count > 0) stopObserving()
  }

  private fun startObserving() {
    mainHandler.post {
      if (isObserving || !hasPhoneStatePermission()) return@post
      isObserving = true
      lastCallState = isCallActive()
      val listener = object : PhoneStateListener() {
        override fun onCallStateChanged(state: Int, phoneNumber: String?) {
          publishCallState(isCallActive() || state != TelephonyManager.CALL_STATE_IDLE)
        }
      }
      phoneStateListener = listener
      val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
      @Suppress("DEPRECATION")
      telephonyManager.listen(listener, PhoneStateListener.LISTEN_CALL_STATE)
      publishCallState(isCallActive(), force = true)
    }
  }

  @Suppress("DEPRECATION")
  private fun stopObserving() {
    mainHandler.post {
      if (!isObserving) return@post
      isObserving = false
      phoneStateListener?.let { listener ->
        val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        telephonyManager.listen(listener, PhoneStateListener.LISTEN_NONE)
      }
      phoneStateListener = null
    }
  }

  private fun hasPhoneStatePermission() = ContextCompat.checkSelfPermission(
    context,
    Manifest.permission.READ_PHONE_STATE,
  ) == PackageManager.PERMISSION_GRANTED

  private fun isCallActive(): Boolean {
    val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    val isCommunicationAudioActive =
      audioManager?.mode == AudioManager.MODE_IN_CALL ||
        audioManager?.mode == AudioManager.MODE_IN_COMMUNICATION
    if (isCommunicationAudioActive) return true

    val telecomManager = context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager
    val isTelecomCallActive = try {
      telecomManager?.isInCall == true
    } catch (_: SecurityException) {
      false
    }
    if (isTelecomCallActive || !hasPhoneStatePermission()) return isTelecomCallActive

    return try {
      val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
      telephonyManager.callState != TelephonyManager.CALL_STATE_IDLE
    } catch (_: SecurityException) {
      false
    }
  }

  private fun publishCallState(active: Boolean, force: Boolean = false) {
    if (!force && lastCallState == active) return
    lastCallState = active
    if (context.hasActiveReactInstance()) {
      context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("callStateChanged", Arguments.createMap().apply { putBoolean("active", active) })
    }
  }
}
