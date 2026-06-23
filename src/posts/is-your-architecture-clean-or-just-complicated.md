---
title: "Is Your Architecture Clean, or Just Complicated?"
date: "2026-06-21"
slug: "is-your-architecture-clean-or-just-complicated"
summary: "Three common ways teams turn Clean Architecture into bureaucratic theater — hollow use cases, logic leaking out of the domain layer, and unnecessary indirection — backed by real file and line-count comparisons."
draft: false
tags: ["Android Development", "Clean Architecture", "Software Architecture", "Kotlin", "Programming"]
cover: "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*E0ZAclmdN9FsJGirHJ6gYQ.png"
---

## Introduction

Clean Architecture has become the default in Android development. Teams adopt the layers (domain, data, presentation) as a checklist item for "serious" projects. The problem is that in practice, a lot of projects inherit the complexity of this architecture without inheriting any of its real benefits.

What you end up with is something I'd call Clean Architecture theater. The folders are named correctly, the layers are technically there, but the discipline behind why each layer exists got lost somewhere along the way. What's left is bureaucracy. What's missing is actual separation of concerns.

This article covers three mistakes I keep running into project after project, backs them up with real numbers.

---

## 1: Hollow use cases

The most common symptom is a use case that does nothing but forward the call to a repository.

```kotlin
class GetUserProfileUseCase @Inject constructor(
    private val repository: UserRepository
) {
    suspend operator fun invoke(userId: String): Result<UserProfile> {
        return repository.getUserProfile(userId)
    }
}
```

No logic. No business rule. No reason for this class to exist beyond "the architecture says every operation needs a use case."

This isn't Clean Architecture, it's cargo culting. It copies the shape of the pattern without understanding what it's for. Robert C. Martin describes use cases in his book as business rules that describe the behavior of the application, not a mandatory proxy that every read or write has to pass through.

---

## 2: Logic leaking out of the right layer

The flip side of the same problem is a use case that exists but doesn't actually hold the logic. It leaks somewhere else instead.

A few common places this happens:

- Business rules end up in the ViewModel. Validation, conditional decisions, transformations that belong in the domain layer get written directly in the presentation layer. The next screen that needs the same rule just copies and pastes it.
- Mappers start carrying domain logic. Instead of doing plain field-to-field conversion, the mapper starts making decisions ("if status is X, return Y"), which is business logic wearing a transformation costume.

The end result is that the architecture promises to prevent duplication, but the logic ends up scattered across exactly the places it was supposed to keep clean.

---

## 3: Being afraid to reference the repository interface

This one is probably the most underrated mistake: assuming every single data call has to go through a use case, even when there's no orchestration happening at all.

The repository interface lives in the domain layer. That's the whole point of the Dependency Inversion Principle in this architecture. A ViewModel injecting that interface directly isn't breaking Clean Architecture, it's depending on a domain abstraction exactly the way the rule intends. The concrete implementation stays isolated in the data layer. Only the contract is exposed.

A use case earns its place when there's:

- Data coming from more than one repository that needs to be combined
- Conditional logic or business rules applied to the result
- Side effects that need to be coordinated (saving data, invalidating a cache, firing an analytics event)
- A business rule that needs to be exposed to another feature without leaking how that rule actually works

If all it does is call `repository.getX()` with nothing else attached, the use case is just noise, and noise has a cost. Martin makes this point directly: building service boundaries where none are needed wastes effort, memory, and cycles, and development effort is the expensive part. There's also a useful YAGNI angle here. Over-engineering tends to hurt more than under-engineering, and a boundary you actually need later is usually cheap to add when the need shows up.

---

## The cost in numbers

Let's use a simple, common feature: fetching a user profile and showing it on screen. No business rule involved, just a read and a render.

### Scenario A: hollow use case

```kotlin
// domain/usecase/GetUserProfileUseCase.kt
interface GetUserProfileUseCase {
    suspend operator fun invoke(userId: String): Result<UserProfile>
}

// domain/usecase/GetUserProfileUseCaseImpl.kt
class GetUserProfileUseCaseImpl(
    private val repository: UserRepository
): GetUserProfileUseCase {
    override suspend operator fun invoke(userId: String): Result<UserProfile> {
        return repository.getUserProfile(userId)
    }
}

// domain/repository/UserRepository.kt
interface UserRepository {
    suspend fun getUserProfile(userId: String): Result<UserProfile>
}

// presentation/viewmodel/UserProfileViewModel.kt
class UserProfileViewModel @Inject constructor(
    private val getUserProfileUseCase: GetUserProfileUseCase
) : ViewModel() {
    fun loadProfile(userId: String) {
        viewModelScope.launch {
            getUserProfileUseCase(userId)
                .onSuccess { _state.value = UiState.Success(it) }
                .onFailure { _state.value = UiState.Error(it.message) }
        }
    }
}
```

### Scenario B: no unnecessary use case

```kotlin
// domain/repository/UserRepository.kt
interface UserRepository {
    suspend fun getUserProfile(userId: String): Result<UserProfile>
}

// presentation/viewmodel/UserProfileViewModel.kt
class UserProfileViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    fun loadProfile(userId: String) {
        viewModelScope.launch {
            repository.getUserProfile(userId)
                .onSuccess { _state.value = UiState.Success(it) }
                .onFailure { _state.value = UiState.Error(it.message) }
        }
    }
}
```

---

## Scaling it up across a project

Numbers are easier to argue with than opinions. Here's what 20 features following this pattern actually cost in files and lines of code, once the repository interface and implementation (which exist either way) are factored in alongside the use case class and its delegation test.

| Metric | **With** hollow use cases | **Without** hollow use cases | Difference |
|---|---|---|---|
| Files | 80 | 40 | −40 files (−50%) |
| Production lines of code | 480 | 300 | −180 lines (−38%) |
| Test lines of code | 400 | 0 | −400 lines (−100%) |
| **Total lines** | **880** | **300** | **−580 lines (−66%)** |

Those numbers are the cost of treating every operation the same way, regardless of whether it carries any real logic. Not every use case deserves that treatment, though.

---

## When a use case actually earns its place

![Diagram: a use case applying a business rule across feature boundaries](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*r7wb857uqUSi_qlTyuHLEg.png)

To be fair, not every use case is dead weight. A use case earns its place when it applies a business rule on top of data, exposing it to the presentation layer across one or more features.

That's exactly the kind of business rule this section is about, and it shows up constantly in multi-module Android projects. Say the home screen needs to decide whether to show a checkout banner.

The rule for whether checkout should be visible (rollout group, user type, region, subscription tier) belongs to the checkout feature, not to home. Home shouldn't know any of those details, it just needs a yes or no answer.

Here's what that looks like in code.

```kotlin
// Inside the checkout feature module (feature-checkout)
// This is the only class exposed in the module's public API
class IsCheckoutVisibleUseCase @Inject constructor(
    private val remoteConfigRepository: RemoteConfigRepository,
    private val userRepository: UserRepository
) {
    suspend operator fun invoke(): Boolean {
        val isRemotelyEnabled = remoteConfigRepository.isEnabled(FeatureFlag.NEW_CHECKOUT)
        val user = userRepository.getCurrentUser()

        return when {
            !isRemotelyEnabled -> false
            user.type == UserType.INTERNAL -> true
            else -> user.isInRolloutGroup
        }
    }
}
```

```kotlin
// Inside the home feature module (feature-home)
// Home only depends on the use case, never on RemoteConfigRepository
// or UserRepository directly
class HomeViewModel @Inject constructor(
    private val isCheckoutVisibleUseCase: IsCheckoutVisibleUseCase
) : ViewModel() {
    fun loadHomeState() {
        viewModelScope.launch {
            val showCheckoutBanner = isCheckoutVisibleUseCase()
            _state.value = _state.value.copy(showCheckoutBanner = showCheckoutBanner)
        }
    }
}
```

This isn't just forwarding a call. The use case applies real business rules (internal users get early access, everyone else depends on the rollout group) and, just as important, it's the only thing the home module is allowed to know about checkout's internal logic.

If home depended on `RemoteConfigRepository` and `UserRepository` directly to figure this out on its own, it would need to duplicate checkout's rollout rules, and any change to those rules would mean updating every feature that copied them.

The real distinction isn't "good use case versus bad use case." It's a use case applying domain rules or guarding a module boundary, versus a use case that just relays a repository call nobody else needed protected.

---

## Conclusion

Clean Architecture was never about hitting a fixed number of layers or wrapping every operation in a use case. It's about well-defined boundaries and the Dependency Rule: outer code depending on inner abstractions, never the other way around.

When the structure gets applied as a ritual instead of a tool, the project ends up with the worst of both worlds: the complexity of multiple layers without the isolation and testability those layers were supposed to provide.

Before adding a new element in your architecture, it's worth asking a simple question: Does it exist because it solves something, or because that's just how it's always done?
