package com.openmaps.saas

import android.app.Application
import org.maplibre.android.MapLibre

class OpenMapsApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Required for stable MapLibre initialization before creating MapView.
        MapLibre.getInstance(this)
    }
}

