package com.openmaps.saas.ui

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.openmaps.saas.location.LocationRepository
import com.openmaps.saas.model.LatLng
import com.openmaps.saas.model.PlaceResult
import com.openmaps.saas.net.NominatimApi
import com.openmaps.saas.net.OsrmApi
import com.openmaps.saas.saas.Feature
import com.openmaps.saas.saas.SaasRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.mapbox.geojson.Feature
import com.mapbox.geojson.FeatureCollection
import com.mapbox.geojson.LineString
import com.mapbox.geojson.Point
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.geometry.LatLng as MlLatLng
import org.maplibre.android.location.LocationComponentActivationOptions
import org.maplibre.android.location.modes.CameraMode
import org.maplibre.android.location.modes.RenderMode
import org.maplibre.android.maps.MapView
import org.maplibre.android.maps.Style
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.PropertyFactory.circleColor
import org.maplibre.android.style.layers.PropertyFactory.circleRadius
import org.maplibre.android.style.layers.PropertyFactory.lineColor
import org.maplibre.android.style.layers.PropertyFactory.lineJoin
import org.maplibre.android.style.layers.PropertyFactory.lineWidth
import org.maplibre.android.style.layers.PropertyFactory.lineCap
import org.maplibre.android.style.sources.GeoJsonSource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapScreen(saasRepo: SaasRepository) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }

    val nominatim = remember { NominatimApi() }
    val osrm = remember { OsrmApi() }
    val locationRepo = remember { LocationRepository(context) }

    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<PlaceResult>>(emptyList()) }
    var selected by remember { mutableStateOf<PlaceResult?>(null) }
    var lastMyLocation by remember { mutableStateOf<LatLng?>(null) }

    var mapViewRef by remember { mutableStateOf<MapView?>(null) }

    val requestPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { /* handled by checking again */ }

    LaunchedEffect(Unit) {
        if (!locationRepo.hasLocationPermission()) {
            requestPermission.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        }
        lastMyLocation = locationRepo.getLastKnownLocation()
    }

    Column(Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("OpenMapsSaaS") },
            actions = {
                Button(
                    onClick = {
                        saasRepo.upgradeToPro()
                        scope.launch { snackbar.showSnackbar("Upgraded to Pro (local stub)") }
                    },
                    modifier = Modifier.padding(end = 8.dp)
                ) { Text("Upgrade") }
            },
            scrollBehavior = androidx.compose.material3.TopAppBarDefaults.pinnedScrollBehavior(rememberTopAppBarState())
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text("Search place") },
                singleLine = true,
                modifier = Modifier.weight(1f)
            )
            Button(
                onClick = {
                    scope.launch {
                        try {
                            results = withContext(Dispatchers.IO) { nominatim.search(query) }
                        } catch (t: Throwable) {
                            snackbar.showSnackbar("Search failed: ${t.message}")
                        }
                    }
                }
            ) { Text("Search") }
        }

        Card(Modifier.padding(horizontal = 12.dp)) {
            AndroidView(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                factory = { ctx -> createMapView(ctx).also { mapViewRef = it } },
                update = { /* no-op */ }
            )
        }

        Spacer(Modifier.size(8.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp)
                .weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = {
                            scope.launch {
                                if (!locationRepo.hasLocationPermission()) {
                                    snackbar.showSnackbar("Location permission not granted")
                                    return@launch
                                }
                                lastMyLocation = locationRepo.getLastKnownLocation()
                                val loc = lastMyLocation
                                if (loc == null) snackbar.showSnackbar("No location available")
                                else {
                                    mapViewRef?.getMapAsync { map ->
                                        map.cameraPosition = CameraPosition.Builder()
                                            .target(MlLatLng(loc.lat, loc.lon))
                                            .zoom(14.5)
                                            .build()
                                    }
                                }
                            }
                        }
                    ) { Text("My location") }

                    Button(
                        enabled = selected != null,
                        onClick = {
                            val dest = selected ?: return@Button
                            val from = lastMyLocation
                            if (from == null) {
                                scope.launch { snackbar.showSnackbar("Get location first") }
                                return@Button
                            }

                            if (!saasRepo.hasFeature(Feature.Routing)) {
                                scope.launch { snackbar.showSnackbar("Routing is Pro. Tap Upgrade.") }
                                return@Button
                            }

                            scope.launch {
                                try {
                                    val route = withContext(Dispatchers.IO) {
                                        osrm.routeDriving(from, dest.location)
                                    }
                                    drawRoute(mapViewRef, route.geometry)
                                    snackbar.showSnackbar(
                                        "Route: ${(route.distanceMeters / 1000.0).format(1)} km, ${(route.durationSeconds / 60.0).format(0)} min"
                                    )
                                } catch (t: Throwable) {
                                    snackbar.showSnackbar("Routing failed: ${t.message}")
                                }
                            }
                        }
                    ) { Text("Route") }
                }
            }

            items(results) { place ->
                Card(
                    onClick = {
                        selected = place
                        results = emptyList()
                        query = place.displayName
                        dropPin(mapViewRef, place.location)
                        moveCamera(mapViewRef, place.location, 14.5)
                    }
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text(place.displayName, style = MaterialTheme.typography.bodyLarge)
                        Text("${place.location.lat}, ${place.location.lon}", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }

        SnackbarHost(hostState = snackbar, modifier = Modifier.padding(12.dp))
    }
}

private fun Double.format(decimals: Int): String = "%.${decimals}f".format(this)

private const val ROUTE_SOURCE_ID = "route-source"
private const val ROUTE_LAYER_ID = "route-layer"
private const val PIN_SOURCE_ID = "pin-source"
private const val PIN_LAYER_ID = "pin-layer"

@SuppressLint("ClickableViewAccessibility")
private fun createMapView(context: Context): MapView {
    val mapView = MapView(context)
    mapView.layoutParams = ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
    )
    mapView.onCreate(null)
    mapView.getMapAsync { map ->
        map.setStyle(Style.Builder().fromUri("asset://osm_raster_style.json")) { style ->
            ensureOverlayLayers(style)
            // Enable location if permission already granted (Compose flow requests too)
            val locComponent = map.locationComponent
            try {
                locComponent.activateLocationComponent(
                    LocationComponentActivationOptions.builder(context, style).build()
                )
                locComponent.isLocationComponentEnabled = true
                locComponent.cameraMode = CameraMode.TRACKING
                locComponent.renderMode = RenderMode.COMPASS
            } catch (_: Throwable) {
                // permission might not be granted yet
            }
        }

        map.uiSettings.apply {
            isCompassEnabled = true
            isRotateGesturesEnabled = true
            isTiltGesturesEnabled = false
            isAttributionEnabled = true
            isLogoEnabled = false
        }
    }
    return mapView
}

private fun moveCamera(mapView: MapView?, target: LatLng, zoom: Double) {
    mapView?.getMapAsync { map ->
        map.cameraPosition = CameraPosition.Builder()
            .target(MlLatLng(target.lat, target.lon))
            .zoom(zoom)
            .build()
    }
}

private fun dropPin(mapView: MapView?, point: LatLng) {
    mapView?.getMapAsync { map ->
        map.style?.let { style ->
            ensureOverlayLayers(style)
            val source = style.getSourceAs<GeoJsonSource>(PIN_SOURCE_ID) ?: return@let
            source.setGeoJson(
                FeatureCollection.fromFeature(
                    Feature.fromGeometry(Point.fromLngLat(point.lon, point.lat))
                )
            )
        }
    }
}

private fun drawRoute(mapView: MapView?, points: List<LatLng>) {
    mapView?.getMapAsync { map ->
        if (points.isEmpty()) return@getMapAsync
        map.style?.let { style ->
            ensureOverlayLayers(style)
            val coords = points.map { Point.fromLngLat(it.lon, it.lat) }
            val line = LineString.fromLngLats(coords)
            style.getSourceAs<GeoJsonSource>(ROUTE_SOURCE_ID)?.setGeoJson(
                FeatureCollection.fromFeature(Feature.fromGeometry(line))
            )
        }
    }
}

private fun ensureOverlayLayers(style: Style) {
    if (style.getSource(ROUTE_SOURCE_ID) == null) {
        style.addSource(GeoJsonSource(ROUTE_SOURCE_ID, FeatureCollection.fromFeatures(emptyList())))
    }
    if (style.getLayer(ROUTE_LAYER_ID) == null) {
        style.addLayer(
            LineLayer(ROUTE_LAYER_ID, ROUTE_SOURCE_ID).withProperties(
                lineColor("#2D7FF9"),
                lineWidth(4.0f),
                lineJoin("round"),
                lineCap("round")
            )
        )
    }

    if (style.getSource(PIN_SOURCE_ID) == null) {
        style.addSource(GeoJsonSource(PIN_SOURCE_ID, FeatureCollection.fromFeatures(emptyList())))
    }
    if (style.getLayer(PIN_LAYER_ID) == null) {
        style.addLayer(
            CircleLayer(PIN_LAYER_ID, PIN_SOURCE_ID).withProperties(
                circleColor("#E53935"),
                circleRadius(7.0f)
            )
        )
    }
}

