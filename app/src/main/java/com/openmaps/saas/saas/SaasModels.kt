package com.openmaps.saas.saas

data class Account(
    val id: String,
    val email: String?,
    val plan: Plan
)

enum class Plan {
    Free,
    Pro
}

enum class Feature {
    Routing,
    OfflineMaps
}

