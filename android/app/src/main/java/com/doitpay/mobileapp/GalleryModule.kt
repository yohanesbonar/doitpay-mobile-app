package co.doitpay.app

import android.content.ActivityNotFoundException
import android.content.Intent
import android.provider.MediaStore
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class GalleryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "GalleryModule"
  }

  @ReactMethod
  fun openImagePicker(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity not available")
      return
    }

    try {
      val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
      intent.type = "image/*"
      val chooser = Intent.createChooser(intent, "Pilih foto")
      activity.startActivity(chooser)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("ERROR", e.message)
    }
  }

  @ReactMethod
  fun openGallery(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity not available")
      return
    }

    try {
      val uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
      val intent = Intent(Intent.ACTION_VIEW)
      intent.setDataAndType(uri, "image/*")
      intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      val chooser = Intent.createChooser(intent, "Buka Galeri")
      activity.startActivity(chooser)
      promise.resolve(true)
    } catch (e: ActivityNotFoundException) {
      promise.reject("NO_APP", "No app found to open gallery")
    } catch (e: Exception) {
      promise.reject("ERROR", e.message)
    }
  }
}
