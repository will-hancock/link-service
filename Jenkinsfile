#!/usr/bin/env groovy

import uk.co.assertis.*

node {
  def logger = new Logger(steps, true)

  def gitVars = new GitVars(this)

  def debBuildOptions = [
    debug: "1"
  ]
  def shBuildOptions = [
  :]
  def unitOptions = [
  :]
  def acceptanceOptions = [
  :]

  def utils = new Utils(this, logger, gitVars, shBuildOptions, unitOptions, acceptanceOptions)
  def debs = new Debs(this, steps, logger, gitVars, utils, "apps.live", debBuildOptions)

  stage("Prepare") {
    checkout scm
    gitVars.setDisplayName()
  }

  if (utils.hasBuildFiles()) {
    stage("Build an app") {
      utils.runBuildFiles()
    }
  }

  utils.runUnitTests()
  debs.buildAndRelease()
}
