'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Shield,
  Settings,
  DollarSign,
  Gamepad2,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { GovernanceProposal, TokenBalance } from '@/lib/gamefi/types';

const proposalSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description too long'),
  category: z.enum(['platform_upgrade', 'fee_adjustment', 'reward_distribution', 'game_curation', 'treasury_usage']),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface GovernancePanelProps {
  tokenBalance: TokenBalance;
  userVotingPower: string;
  onVote?: (proposalId: string, support: boolean, votingPower: string) => void;
  onCreateProposal?: (proposal: Omit<GovernanceProposal, 'id' | 'proposer' | 'votesFor' | 'votesAgainst' | 'startTime' | 'endTime' | 'status'>) => void;
}

export function GovernancePanel({ 
  tokenBalance, 
  userVotingPower, 
  onVote, 
  onCreateProposal 
}: GovernancePanelProps) {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([
    {
      id: '1',
      title: 'Reduce Platform Fee from 2.5% to 2.0%',
      description: 'Proposal to reduce the platform fee to make the ecosystem more attractive for creators and increase overall volume. This would reduce platform revenue but potentially increase total transactions.',
      proposer: '0x1234...5678',
      category: 'fee_adjustment',
      votingPower: '100000',
      votesFor: '75000',
      votesAgainst: '15000',
      startTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
      status: 'active',
      quorum: 10,
    },
    {
      id: '2',
      title: 'Implement Game Quality Scoring System',
      description: 'Introduce an automated quality scoring system for games based on play time, retention, and community feedback. Games with higher scores would receive promotional benefits.',
      proposer: '0x8765...4321',
      category: 'game_curation',
      votingPower: '50000',
      votesFor: '45000',
      votesAgainst: '3000',
      startTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
      endTime: Date.now() + 2 * 24 * 60 * 60 * 1000,
      status: 'active',
      quorum: 10,
    },
    {
      id: '3',
      title: 'Treasury Allocation for Developer Grants',
      description: 'Allocate 500,000 JEU from the treasury to fund a developer grants program for promising game creators. This would help bootstrap high-quality games on the platform.',
      proposer: '0xabcd...efgh',
      category: 'treasury_usage',
      votingPower: '200000',
      votesFor: '180000',
      votesAgainst: '20000',
      startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
      endTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // Ended 1 day ago
      status: 'passed',
      quorum: 10,
    }
  ]);

  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [voteAmount, setVoteAmount] = useState('');

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'platform_upgrade',
    },
  });

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!voteAmount || parseFloat(voteAmount) <= 0) {
      toast.error('Please enter a valid voting amount');
      return;
    }

    if (parseFloat(voteAmount) > parseFloat(userVotingPower)) {
      toast.error('Insufficient voting power');
      return;
    }

    setIsVoting(true);
    try {
      // Simulate voting transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update proposal votes
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: support 
              ? (parseFloat(p.votesFor) + parseFloat(voteAmount)).toString()
              : p.votesFor,
            votesAgainst: !support 
              ? (parseFloat(p.votesAgainst) + parseFloat(voteAmount)).toString()
              : p.votesAgainst,
          };
        }
        return p;
      }));

      toast.success(`Vote cast successfully!`, {
        description: `Voted ${support ? 'FOR' : 'AGAINST'} with ${voteAmount} JEU`,
      });

      onVote?.(proposalId, support, voteAmount);
      setVoteAmount('');
      setSelectedProposal(null);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCreateProposal = async (data: ProposalFormData) => {
    setIsCreatingProposal(true);
    try {
      // Check if user has enough voting power to create proposal
      if (parseFloat(userVotingPower) < 10000) {
        toast.error('Insufficient voting power', {
          description: 'You need at least 10,000 JEU to create a proposal',
        });
        return;
      }

      // Simulate proposal creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newProposal: GovernanceProposal = {
        id: Date.now().toString(),
        ...data,
        proposer: 'You',
        votingPower: '10000',
        votesFor: '0',
        votesAgainst: '0',
        startTime: Date.now(),
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        status: 'active',
        quorum: 10,
      };

      setProposals(prev => [newProposal, ...prev]);

      toast.success('Proposal created successfully!', {
        description: 'Your proposal is now live for voting',
      });

      onCreateProposal?.(data);
      form.reset();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Failed to create proposal');
    } finally {
      setIsCreatingProposal(false);
    }
  };

  const getProposalStatus = (proposal: GovernanceProposal) => {
    const now = Date.now();
    const totalVotes = parseFloat(proposal.votesFor) + parseFloat(proposal.votesAgainst);
    const quorumMet = (totalVotes / parseFloat(proposal.votingPower)) * 100 >= proposal.quorum;
    const votesForPercentage = totalVotes > 0 ? (parseFloat(proposal.votesFor) / totalVotes) * 100 : 0;

    if (proposal.status === 'passed') return { status: 'Passed', color: 'bg-green-500', icon: CheckCircle };
    if (proposal.status === 'rejected') return { status: 'Rejected', color: 'bg-red-500', icon: XCircle };
    if (now > proposal.endTime) {
      if (quorumMet && votesForPercentage > 50) {
        return { status: 'Passed', color: 'bg-green-500', icon: CheckCircle };
      } else {
        return { status: 'Rejected', color: 'bg-red-500', icon: XCircle };
      }
    }
    if (!quorumMet) return { status: 'Quorum Not Met', color: 'bg-orange-500', icon: AlertCircle };
    return { status: 'Active', color: 'bg-blue-500', icon: Vote };
  };

  const getCategoryIcon = (category: GovernanceProposal['category']) => {
    switch (category) {
      case 'platform_upgrade': return <TrendingUp className="h-4 w-4" />;
      case 'fee_adjustment': return <DollarSign className="h-4 w-4" />;
      case 'reward_distribution': return <Users className="h-4 w-4" />;
      case 'game_curation': return <Gamepad2 className="h-4 w-4" />;
      case 'treasury_usage': return <Shield className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: GovernanceProposal['category']) => {
    switch (category) {
      case 'platform_upgrade': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'fee_adjustment': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'reward_distribution': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'game_curation': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'treasury_usage': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const activeProposals = proposals.filter(p => p.status === 'active');
  const pastProposals = proposals.filter(p => p.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Governance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-blue-500" />
            Governance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{parseFloat(userVotingPower).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Your Voting Power</div>
              <div className="text-xs text-green-600">JEU tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeProposals.length}</div>
              <div className="text-xs text-muted-foreground">Active Proposals</div>
              <div className="text-xs text-green-600">Awaiting votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{proposals.length}</div>
              <div className="text-xs text-muted-foreground">Total Proposals</div>
              <div className="text-xs text-green-600">All time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">67%</div>
              <div className="text-xs text-muted-foreground">Participation Rate</div>
              <div className="text-xs text-green-600">Average turnout</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Proposal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Governance Proposals</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
              <DialogDescription>
                Submit a proposal for the community to vote on. You need at least 10,000 JEU to create a proposal.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateProposal)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter proposal title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select proposal category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="platform_upgrade">Platform Upgrade</SelectItem>
                          <SelectItem value="fee_adjustment">Fee Adjustment</SelectItem>
                          <SelectItem value="reward_distribution">Reward Distribution</SelectItem>
                          <SelectItem value="game_curation">Game Curation</SelectItem>
                          <SelectItem value="treasury_usage">Treasury Usage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of your proposal..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isCreatingProposal}>
                    {isCreatingProposal ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Proposal'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Proposals ({activeProposals.length})</TabsTrigger>
          <TabsTrigger value="past">Past Proposals ({pastProposals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeProposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Vote className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Proposals</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are currently no active proposals. Create one to get the community involved!
                </p>
              </CardContent>
            </Card>
          ) : (
            activeProposals.map((proposal) => {
              const statusInfo = getProposalStatus(proposal);
              const StatusIcon = statusInfo.icon;
              const totalVotes = parseFloat(proposal.votesFor) + parseFloat(proposal.votesAgainst);
              const votesForPercentage = totalVotes > 0 ? (parseFloat(proposal.votesFor) / totalVotes) * 100 : 0;
              const timeLeft = Math.max(0, proposal.endTime - Date.now());
              const daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
              const hoursLeft = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

              return (
                <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                            {getCategoryIcon(proposal.category)}
                            <span className="ml-1 capitalize">{proposal.category.replace('_', ' ')}</span>
                          </Badge>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span>By {proposal.proposer}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h left` : `${hoursLeft}h left`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{proposal.description}</p>
                    
                    {/* Voting Results */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Support ({votesForPercentage.toFixed(1)}%)</span>
                        <span>{parseFloat(proposal.votesFor).toLocaleString()} JEU</span>
                      </div>
                      <Progress value={votesForPercentage} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Against ({(100 - votesForPercentage).toFixed(1)}%)</span>
                        <span className="text-muted-foreground">{parseFloat(proposal.votesAgainst).toLocaleString()} JEU</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Quorum: {proposal.quorum}%</span>
                        <span>Total Votes: {totalVotes.toLocaleString()} JEU</span>
                      </div>
                    </div>

                    {/* Vote Buttons */}
                    {proposal.status === 'active' && timeLeft > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedProposal(proposal)}
                          >
                            <Vote className="h-4 w-4 mr-2" />
                            Cast Vote
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cast Your Vote</DialogTitle>
                            <DialogDescription>
                              Vote on: {proposal.title}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Voting Power to Use</label>
                              <Input
                                type="number"
                                placeholder="Enter amount of JEU to vote with"
                                value={voteAmount}
                                onChange={(e) => setVoteAmount(e.target.value)}
                                max={userVotingPower}
                              />
                              <div className="text-xs text-muted-foreground mt-1">
                                Available: {parseFloat(userVotingPower).toLocaleString()} JEU
                              </div>
                            </div>
                          </div>

                          <DialogFooter className="gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleVote(proposal.id, false)}
                              disabled={isVoting || !voteAmount}
                              className="flex-1"
                            >
                              {isVoting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Vote Against
                            </Button>
                            <Button
                              onClick={() => handleVote(proposal.id, true)}
                              disabled={isVoting || !voteAmount}
                              className="flex-1"
                            >
                              {isVoting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Vote For
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastProposals.map((proposal) => {
            const statusInfo = getProposalStatus(proposal);
            const StatusIcon = statusInfo.icon;
            const totalVotes = parseFloat(proposal.votesFor) + parseFloat(proposal.votesAgainst);
            const votesForPercentage = totalVotes > 0 ? (parseFloat(proposal.votesFor) / totalVotes) * 100 : 0;

            return (
              <Card key={proposal.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                          {getCategoryIcon(proposal.category)}
                          <span className="ml-1 capitalize">{proposal.category.replace('_', ' ')}</span>
                        </Badge>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-2">
                        By {proposal.proposer} • Ended {new Date(proposal.endTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{proposal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Final Result: {votesForPercentage.toFixed(1)}% Support</span>
                      <span>Total: {totalVotes.toLocaleString()} JEU</span>
                    </div>
                    <Progress value={votesForPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}