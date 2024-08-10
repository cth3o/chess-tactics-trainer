'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import MultipleSelector, { Option } from '@/components/ui/multiple-select'
import { cn } from '@/lib/utils'
import { Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useGameStore } from './game.store'

const platformOptions: Option[] = [
  { label: 'chess.com', value: 'chesscom' },
  { label: 'lichess.org', value: 'lichess' }
]

const categoryOptions: Option[] = [
  { label: 'Bullet', value: 'bullet' },
  { label: 'Blitz', value: 'blitz' },
  { label: 'Rapid', value: 'rapid' },
  { label: 'Classical', value: 'classical' },
  { label: 'Daily', value: 'daily' }
]

const gamewinnerOptions: Option[] = [
  { label: 'Win', value: 'win' },
  { label: 'Loose', value: 'loose' },
  { label: 'Draw', value: 'draw' }
]

const tagOptions = [
  { label: 'Mate', value: 'mate' },
  { label: 'Draw', value: 'draw' },
  { label: 'Resign', value: 'resign' },
  { label: 'Out of time', value: 'outoftime' },
  { label: 'Timeout', value: 'timeout' },
  { label: 'Stalemate', value: 'stalemate' }
]

const analysedOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]

export const FilterButton = () => {
  const [open, setOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useGameStore((state) => [state.filters, state.setFilters])
  const [editedFilters, setEditedFilters] = useState(selectedFilters)

  const handleApplyFilters = () => {
    setSelectedFilters(editedFilters)
    setOpen(false)
  }

  const handleClearFilters = () => {
    const emptyFilters = {
      providers: [],
      tags: [],
      winner: [],
      categories: [],
      analysed: [],
      adversary: []
    }
    setEditedFilters(emptyFilters)
    setSelectedFilters(emptyFilters)
    setOpen(false)
  }

  const handleChangeOpen = (newOpen: boolean) => {
    setOpen(newOpen)
    setEditedFilters(selectedFilters)
  }

  const isActiveFilter = useMemo(() => {
    return (
      selectedFilters.providers.length > 0 ||
      selectedFilters.tags.length > 0 ||
      selectedFilters.winner.length > 0 ||
      selectedFilters.categories.length > 0 ||
      selectedFilters.analysed.length > 0 ||
      selectedFilters.adversary.length > 0
    )
  }, [selectedFilters])

  return (
    <Dialog open={open} onOpenChange={handleChangeOpen}>
      <DialogTrigger asChild>
        <Button variant='link' className='text-white hover:text-primary'>
          <Filter className={cn('w-6 h-6', {
            'text-active hover:text-primary': isActiveFilter
          })} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='border-primary text-white w-3/4 md:w-2/3 lg:w-1/2 '
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-white'>Filtering games</DialogTitle>
        </DialogHeader>
        <div className='w-full grid gap-4 grid-cols-12 py-4'>
          <div className='col-span-5'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              badgeClassName='text-white'
              defaultOptions={platformOptions}
              commandProps={{
                className: 'bg-background'
              }}
              placeholder='Select chess platform'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.providers.map(
                (provider) => platformOptions.find((po) => po.value === provider)
              ).filter((v) => v !== undefined)}
              onChange={(value) => { setEditedFilters({ ...editedFilters, providers: value.map((v) => v.value) }) }}
            />
          </div>
          <div className='col-span-7 flex flex-col gap-1'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              commandProps={{
                className: 'bg-foreground'
              }}
              badgeClassName='text-white'
              defaultOptions={categoryOptions}
              placeholder='Select speed category'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.categories.map(
                (c) => categoryOptions.find((co) => co.value === c)
              ).filter((v) => v !== undefined)}
              onChange={(value) => { setEditedFilters({ ...editedFilters, categories: value.map((v) => v.value) }) }}
            />
          </div>

          <div className='col-span-7 flex flex-col gap-1'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              commandProps={{
                className: 'bg-foreground'
              }}
              badgeClassName='text-white'
              defaultOptions={tagOptions}
              placeholder='Select tags'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.tags.map(
                  (t) => tagOptions.find((to) => to.value === t)
                ).filter((v) => v !== undefined)
              }
              onChange={(value) => { setEditedFilters({ ...editedFilters, tags: value.map((v) => v.value) }) }}
            />
          </div>
          <div className='col-span-5 flex flex-col gap-1'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              commandProps={{
                className: 'bg-foreground'
              }}
              badgeClassName='text-white'
              defaultOptions={gamewinnerOptions}
              placeholder='Select game winner'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.winner.map(
                (s) => gamewinnerOptions.find((so) => so.value === s))
                .filter((v) => v !== undefined)
              }
              onChange={(value) => { setEditedFilters({ ...editedFilters, winner: value.map((v) => v.value) }) }}
            />
          </div>
          <div className='col-span-4 flex flex-col gap-1'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              commandProps={{
                className: 'bg-foreground'
              }}
              badgeClassName='text-white'
              defaultOptions={analysedOptions}
              placeholder='Select analysed'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.analysed.map(
                  (a) => analysedOptions.find((ao) => ao.value === a)
                ).filter((v) => v !== undefined)
            }
              onChange={(value) => { setEditedFilters({ ...editedFilters, analysed: value.map((v) => v.value) }) }}
            />
          </div>

          <div className='col-span-8 flex flex-col gap-1'>
            <MultipleSelector
              className='w-full text-white border-primary bg-foreground'
              commandProps={{
                className: 'bg-foreground'
              }}
              creatable
              badgeClassName='text-white'
              defaultOptions={[]}
              placeholder='Select adversary'
              emptyIndicator={null}
              hidePlaceholderWhenSelected
              value={editedFilters.adversary.map((a) => ({ label: a, value: a }))}
              onChange={(value) => { setEditedFilters({ ...editedFilters, adversary: value.map((v) => v.value) }) }}
            />
          </div>
          {/* <div className='col-span-6 flex flex-col gap-1'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left bg-foreground  text-muted-foreground font-normal border-primary 
                    hover:bg-background hover:text-muted-foreground'
                  )}
                >
                  <span>Select min date</span>

                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='border-foreground border-1 p-0 h-24'
                align='center'
                >
                <Calendar
                  mode='single'
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  className='bg-foreground'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='col-span-6 flex flex-col gap-1'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left bg-foreground  text-muted-foreground font-normal border-primary 
                    hover:bg-background hover:text-muted-foreground'
                  )}
                >
                  <span>Select max date</span>

                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='bg-background border-foreground border-1 p-0'
                align='center'
              >
                <Calendar
                  mode='single'
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  selected={date2}
                  onSelect={setDate2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div> */}
        </div>
        {/* <Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !false && "text-muted-foreground"
                      )}
                    >
                     
                        <span>Pick a date</span>
                      
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // selected={field.value}
                    // onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}

        <DialogFooter>
          <Button variant='outline' onClick={handleClearFilters}>Clear</Button>
          <Button type='submit' onClick={handleApplyFilters}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
