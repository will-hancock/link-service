#!/usr/bin/env groovy

import uk.co.assertis.*

node {
  def logger = new Logger(steps, true)

  def vars = new GitVars(this)
  def buildOptions = [
    debug: "1",
  ]
  def acceptance = [		
  :]
  def utils = new Utils(this, logger, vars, null, acceptance)
  def debs = new Debs(steps, this, logger, vars, utils, "apps.live", buildOptions)

  stage("Prepare") {
    checkout scm
    vars.setDisplayName()
  }

  utils.runUnitTests()
  debs.buildAndRelease()
}
