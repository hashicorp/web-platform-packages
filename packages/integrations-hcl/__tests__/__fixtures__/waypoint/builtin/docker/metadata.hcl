integration {
  name        = "Docker"
  description = "Use Waypoint on a Docker instance."
  identifier  = "waypoint/docker"
  flags       = ["builtin"]

  component {
    type = "builder"
    name = "Docker Builder"
    slug = "docker-builder"
  }

  component {
    type = "platform"
    name = "Docker Platform"
    slug = "docker-platform"
  }

  component {
    type = "registry"
    name = "Docker Registry"
    slug = "docker-registry"
  }

  component {
    type = "task"
    name = "Docker Task"
    slug = "docker-task"
  }

  license {
    type = "MPL-2.0"
    url  = "https://github.com/hashicorp/waypoint/blob/main/LICENSE"
  }
}
