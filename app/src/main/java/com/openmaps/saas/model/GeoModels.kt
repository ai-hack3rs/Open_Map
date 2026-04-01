package com.openmaps.saas.model

data class LatLng(val lat: Double, val lon: Double)

data class PlaceResult(
    val displayName: String,
    val location: LatLng
)

data class RouteResult(
    val distanceMeters: Double,
    val durationSeconds: Double,
    val geometry: List<LatLng>
)

