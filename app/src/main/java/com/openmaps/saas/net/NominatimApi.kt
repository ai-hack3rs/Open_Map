package com.openmaps.saas.net

import com.openmaps.saas.model.LatLng
import com.openmaps.saas.model.PlaceResult
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.Request

class NominatimApi(
    private val baseUrl: String = "https://nominatim.openstreetmap.org"
) {
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun search(query: String, limit: Int = 8): List<PlaceResult> {
        val url = (baseUrl + "/search").toHttpUrl().newBuilder()
            .addQueryParameter("q", query)
            .addQueryParameter("format", "jsonv2")
            .addQueryParameter("addressdetails", "0")
            .addQueryParameter("limit", limit.toString())
            .build()

        val req = Request.Builder()
            .url(url)
            .get()
            .build()

        val body = HttpClient.okHttp.newCall(req).execute().use { resp ->
            if (!resp.isSuccessful) error("Nominatim HTTP ${resp.code}")
            resp.body?.string() ?: error("Empty response")
        }

        val parsed = json.decodeFromString<List<NominatimSearchItem>>(body)
        return parsed.mapNotNull { item ->
            val lat = item.lat?.toDoubleOrNull()
            val lon = item.lon?.toDoubleOrNull()
            if (lat == null || lon == null) null
            else PlaceResult(displayName = item.displayName ?: "Unknown", location = LatLng(lat, lon))
        }
    }

    @Serializable
    private data class NominatimSearchItem(
        @SerialName("display_name") val displayName: String? = null,
        val lat: String? = null,
        val lon: String? = null
    )
}

