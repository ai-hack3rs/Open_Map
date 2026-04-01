package com.openmaps.saas.net

import com.openmaps.saas.model.LatLng
import com.openmaps.saas.model.RouteResult
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.Request
import kotlin.math.abs

class OsrmApi(
    private val baseUrl: String = "https://router.project-osrm.org"
) {
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun routeDriving(from: LatLng, to: LatLng): RouteResult {
        // OSRM expects lon,lat pairs
        val path = "/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}"
        val url = (baseUrl + path).toHttpUrl().newBuilder()
            .addQueryParameter("overview", "full")
            .addQueryParameter("geometries", "geojson")
            .build()

        val req = Request.Builder().url(url).get().build()
        val body = HttpClient.okHttp.newCall(req).execute().use { resp ->
            if (!resp.isSuccessful) error("OSRM HTTP ${resp.code}")
            resp.body?.string() ?: error("Empty response")
        }

        val parsed = json.decodeFromString<OsrmRouteResponse>(body)
        val route = parsed.routes?.firstOrNull() ?: error("No routes")
        val coords = route.geometry?.coordinates ?: error("Missing geometry")
        val points = coords.map { LatLng(lat = it[1], lon = it[0]) }
        return RouteResult(
            distanceMeters = route.distance ?: 0.0,
            durationSeconds = route.duration ?: 0.0,
            geometry = points
        )
    }

    @Serializable
    private data class OsrmRouteResponse(
        val code: String? = null,
        val routes: List<OsrmRoute>? = null
    )

    @Serializable
    private data class OsrmRoute(
        val distance: Double? = null,
        val duration: Double? = null,
        val geometry: OsrmGeometry? = null
    )

    @Serializable
    private data class OsrmGeometry(
        val type: String? = null,
        val coordinates: List<List<Double>>? = null
    )
}

