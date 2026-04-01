package com.openmaps.saas

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.openmaps.saas.saas.InMemorySaasRepository
import com.openmaps.saas.ui.MapScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val saasRepo = InMemorySaasRepository()

        setContent {
            MaterialTheme {
                Surface {
                    MapScreen(saasRepo = saasRepo)
                }
            }
        }
    }
}

