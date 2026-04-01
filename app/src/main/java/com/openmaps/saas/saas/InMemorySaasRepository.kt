package com.openmaps.saas.saas

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class InMemorySaasRepository : SaasRepository {
    private val _account = MutableStateFlow(Account(id = "local", email = null, plan = Plan.Free))
    override val account: StateFlow<Account> = _account.asStateFlow()

    override fun hasFeature(feature: Feature): Boolean {
        val plan = _account.value.plan
        return when (feature) {
            Feature.Routing -> plan == Plan.Pro
            Feature.OfflineMaps -> plan == Plan.Pro
        }
    }

    override fun upgradeToPro() {
        _account.value = _account.value.copy(plan = Plan.Pro)
    }
}

