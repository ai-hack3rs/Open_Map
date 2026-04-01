package com.openmaps.saas.saas

import kotlinx.coroutines.flow.StateFlow

interface SaasRepository {
    val account: StateFlow<Account>

    fun hasFeature(feature: Feature): Boolean

    fun upgradeToPro()
}

