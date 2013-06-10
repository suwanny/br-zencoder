# rake build
# rake clobber
# 

require 'rake'
require 'rake/clean'
require 'fileutils'

# Defines
Home = Rake.original_dir

ClobberList = [
  "#{Home}/lib/**/*.js"
]

@tasks_help = []
def hdoc command, desc
  @tasks_help << [command, desc]
end


CoffeeBin = "node_modules/coffee-script/bin/coffee"
MochaBin  = "node_modules/.bin/mocha"

CLOBBER.include(ClobberList)
task :default => [:help]

task :help do
  @tasks_help.each do |task|
    if task[1].size > 0
      output = "  rake %-20s: %s" % [task[0], task[1]]
    else
      output = "\n+ %-30s %s\n\n" % [task[0], '*'*60 ]
    end
    puts output
  end
end

hdoc 'init', 'npm install: download all dependencies.'
task :init do
  sh "npm install"
end

hdoc'compile', 'compile coffee-script codes to javascript.'
task :compile => [:init, :clobber] do
  sh "#{CoffeeBin} --lint -c -o lib/ src/"
end

task :c => [:compile]

hdoc 'spec', 'run unit tests'
task :spec => [:compile] do
  sh "#{MochaBin} -R spec --recursive spec"
end


