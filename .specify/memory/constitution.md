<!--
Sync Impact Report (temporary; remove before committing the amended constitution)

- Version change: unratified template placeholders → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Spec-First Delivery (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Explicit, Observable Interfaces
  - [PRINCIPLE_3_NAME] → III. Test-First (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] → IV. Integration Verification
  - [PRINCIPLE_5_NAME] → V. Simplicity and Justified Complexity
- Added sections:
  - Additional Constraints
  - Development Workflow
  - Governance (filled from [GOVERNANCE_RULES])
- Removed sections: none (template comments removed after replacement)
- Follow-up TODOs:
  - TODO(TECHNOLOGY_STACK): application stack is not present in the repo yet
  - TODO(GUIDANCE_FILE): no runtime developer-guide file exists yet
-->

# AURA 2.0 Constitution

## Core Principles

### I. Spec-First Delivery (NON-NEGOTIABLE)

Every planned change MUST begin as a feature specification before
implementation. A feature MUST NOT be coded until it has:

- A specification that names users, independent user stories, and
  acceptance scenarios
- A plan that records architecture and constraints for that feature
- A task list that maps stories to independently verifiable work

Ad-hoc patches that fix a proven defect MAY land without a new feature
spec only when they do not change user-visible behavior. Any behavior
change MUST go through specify → plan → tasks first.

Rationale: this repository is governed by Spec Kit. Specs are the
contract; code is the fulfillment of that contract.

### II. Explicit, Observable Interfaces

Every capability MUST be reachable through a documented interface with
observable inputs and outputs. That interface MAY be a CLI, HTTP API,
UI route, or library API, but it MUST be named in the feature spec and
exercisable without undocumented side channels.

Interface contracts MUST:

- Define success output and failure output
- Prefer structured, inspectable payloads (for example JSON) in
  addition to any human-readable form
- Keep secrets and credentials out of interface examples and logs

Rationale: AURA 2.0 has no locked runtime yet. Requiring an explicit
contract keeps modules testable and replaceable when the stack is chosen.

### III. Test-First (NON-NEGOTIABLE)

Behavior MUST be specified as failing tests before production code is
written. The required order is:

1. Write tests from the spec's acceptance scenarios
2. Confirm the tests fail for the right reason
3. Implement the minimum code that makes those tests pass
4. Refactor only while tests remain green

A task is not complete until its acceptance scenarios have automated
coverage or an explicit, recorded reason why automation is impossible
(for example a hardware-only check). "Works on my machine" is not
evidence.

### IV. Integration Verification

Unit tests are not sufficient where two modules share a contract.
Integration tests MUST cover:

- New or changed public interfaces
- Shared schemas, events, and data shapes
- Communication between services, processes, or UI and backend
- Persistence and recovery of user-visible state

A contract change MUST update both producer and consumer tests in the
same change set. Shipping one side of a breaking contract is forbidden.

### V. Simplicity and Justified Complexity

The default is the smallest design that satisfies the current spec.
A contributor MUST NOT add layers, frameworks, or speculative
extension points that the active spec does not require.

When complexity is proposed, the plan MUST record:

- The spec requirement it satisfies
- What was rejected as simpler and why it fails
- How the extra surface will be tested

Unused code, dead flags, and "for later" abstractions MUST be removed
or never merged.

## Additional Constraints

- **Secrets**: credentials, API keys, and private environment values
  MUST NOT be committed. Configuration MUST use untracked env files or
  secret stores.
- **Source of truth**: `.specify/` specs, plans, and tasks are the
  planned-work record. Implementation MUST NOT silently diverge; if
  reality changes, the spec artifacts MUST be updated in the same
  change.
- **TODO(TECHNOLOGY_STACK)**: no application stack is present in this
  repository yet. Stack, runtime, and deployment rules MUST be added
  here when the first implementation plan selects them. Until then,
  plans MUST name their proposed stack explicitly rather than assuming
  a default.
- **Safety**: features MUST NOT introduce unauthorized access,
  credential capture, or other offensive-security capabilities.
- **Scope discipline**: a change MUST stay inside the active feature's
  spec. Unrelated refactors belong in a separate spec.

## Development Workflow

Work MUST follow this sequence unless Governance records an exception:

1. Specify the feature (`/speckit-specify`)
2. Clarify underspecified requirements when needed (`/speckit-clarify`)
3. Plan the design (`/speckit-plan`)
4. Generate tasks (`/speckit-tasks`)
5. Analyze spec/plan/tasks consistency (`/speckit-analyze`)
6. Implement only listed tasks (`/speckit-implement`)
7. Converge remaining unbuilt work back into tasks (`/speckit-converge`)
  when implementation would otherwise invent scope

Quality gates before a feature is considered done:

- Constitution principles I–V are satisfied
- Acceptance scenarios pass
- Integration contracts covered by Principle IV are tested
- No unexplained placeholder tokens remain in the feature's spec
  artifacts
- UI or layout changes are verified in a browser or the closest
  available substitute, and that substitute is recorded

Reviews (including self-review on solo work) MUST check constitution
compliance, not only style. Complexity introduced without a plan
justification MUST be rejected.

TODO(GUIDANCE_FILE): when a runtime developer guide exists, this
section MUST point to it as the operational companion to this
constitution.

## Governance

This constitution supersedes informal practice, README notes, and chat
agreements. If those sources conflict with this file, this file wins.

Amendments:

- MUST be written into `.specify/memory/constitution.md`
- MUST bump `CONSTITUTION_VERSION` using semantic versioning:
  - MAJOR: removal or incompatible redefinition of a principle
  - MINOR: new principle or section, or material expansion of guidance
  - PATCH: clarification, wording, or non-semantic refinement
- MUST set **Last Amended** to the amendment date (ISO `YYYY-MM-DD`)
- MUST keep **Ratified** as the original adoption date
- MUST include a migration note when existing specs or code would
  become non-compliant

Compliance:

- Every feature plan and PR (or equivalent review) MUST verify these
  principles
- Exceptions MUST be time-bounded, written in the feature plan, and
  MUST name the principle being waived
- Version, ratification, and amendment metadata below MUST stay in
  sync with the file contents

**Version**: 1.0.0 | **Ratified**: 2026-10-21 | **Last Amended**: 2026-10-21
